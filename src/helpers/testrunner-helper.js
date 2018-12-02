'use strict';

var exports = module.exports = {};

const Promise = require('bluebird');
const cmd = require('node-cmd');

const appRoot = __dirname.replace('node_modules/comprehensive-js-coverage/src/helpers', '');
const moduleRootPath = __dirname.replace('src/helpers', '');

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });

/**
 * Installs dependencies for the local copy and run unit tests
 * @return {void}
 */

exports.installDependenciesRunTests = (basebranch, cb) => {
    getAsync(`
            cd ${moduleRootPath}local_copy
            npm install
            npm run cover
            mv coverage ${appRoot}comprehensive_coverage/${basebranch}/
        `).then(data => {
                for (let item of data) {
                    console.log(item);
                }
                console.log('Process completed for ' + basebranch + '...');
                cb();
            }).catch(err => {
                console.log('cmd err: ', err);
            });
};
