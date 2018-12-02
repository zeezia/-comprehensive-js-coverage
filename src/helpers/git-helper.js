'use strict';

var exports = module.exports = {};

const rp = require('request-promise');
const https = require('https');
const fs = require('fs');
const rimraf = require('rimraf');

const appRoot = __dirname.replace('node_modules/comprehensive-js-coverage/src/helpers', '');
const moduleRootPath = __dirname.replace('src/helpers', '');

var localCopyBasePath = moduleRootPath + 'local_copy/';
var comprehensiveCoverageBasePath = appRoot + 'comprehensive_coverage/';

var repository, repository_owner, base_branch = '';
var dirsToTraverse = [];

// Create/clean comprehensive_coverage folder
if(!fs.existsSync(comprehensiveCoverageBasePath)){
    fs.mkdirSync(comprehensiveCoverageBasePath);
    console.log(comprehensiveCoverageBasePath + ' created ...');
} else {
    rimraf(comprehensiveCoverageBasePath + '*', () => { 
        console.log(comprehensiveCoverageBasePath + ' cleaned ...'); 
    });
}

var download = (url, dest, cb) => {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close(cb);
        });
    }).on('error', (err) => { 
        fs.unlink(dest);
        if (cb) cb(err.message);
    });
};

var fetchCloneDirContents = (path, cb) => {
    var pathWithoutSlash = '';
    if (path && path.charAt(path.length - 1) === '/') {
        pathWithoutSlash = path.slice(0, -1);
    }
    var url = 'https://api.github.com/repos/' + repository_owner + '/' + repository + '/contents/' + pathWithoutSlash;
    if(base_branch){
        url += '?ref=' + base_branch;
    }
    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then( (response) => {
            response = response.map( item => {
                var directoryItem =  {
                    name: item.name,
                    path: item.path,
                    sha: item.sha,
                    size: item.size,
                    download_url: item.download_url,
                    type: item.type
                };
                var dest = localCopyBasePath + path + directoryItem.name;
                if(directoryItem.type === 'file'){
                    download(directoryItem.download_url, dest, (res) => {
                        console.log(dest + ' successfully cloned ...');
                    });
                } else if(directoryItem.type === 'dir'){
                    if(!fs.existsSync(dest)){
                        fs.mkdirSync(dest);
                    }
                    dirsToTraverse.push(directoryItem.path + '/');
                }
                return directoryItem;
            });
            
            console.log('dirsToTraverse - ', dirsToTraverse);

            if(dirsToTraverse.length > 0){
                fetchCloneDirContents(dirsToTraverse.shift(), cb)
            } else{
                cb();
            }
        })
        .catch( (err) => {
            console.error(err);
        });
}

/**
 * Fetches contents of the specified repository
 * @param {string} repo
 * @param {string} owner
 * @param {string} basebranch
 * @return {void}
 */
exports.cloneBranch = (repo, owner, basebranch, cb) => {
    repository = repo;
    repository_owner = owner;
    base_branch = basebranch;
    
    // Create/clean local_copy folder
    if(!fs.existsSync(localCopyBasePath)){
        fs.mkdirSync(localCopyBasePath);
        console.log(localCopyBasePath + ' created ...');
    } else {
        rimraf(localCopyBasePath + '*', () => { 
            console.log(localCopyBasePath + ' cleaned ...'); 
        });
    }
    
    fetchCloneDirContents('', cb);
};

/**
 * Fetches a list of opened PRs for the base-branch
 */
exports.fetchOpenPRs = (repo, owner, basebranch, cb) => {
    var url = 'https://api.github.com/repos/' + owner + '/' + repo + '/pulls?base=' + basebranch;
    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then( (response) => {
            response = response.map( item => {
                return {
                    ref: item.head.ref,
                    number: item.number,
                    state: item.state,
                    title: item.title,
                    user_login: item.user.login,
                    sha: item.head.sha 
                };
            });
            response = response.filter( item => item.state === 'open');
            cb(response);
        })
        .catch( (err) => {
            console.error(err);
        });
};
