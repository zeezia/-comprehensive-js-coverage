'use strict';

const GitHelper = require('./helpers/git-helper');
const TestRunner = require('./helpers/testrunner-helper');

var repository, repository_owner = '';
var openedPRs = [];

var prBranchCloneTest = () => {
    if(openedPRs.length > 0){
        var prObject = openedPRs.shift();
        GitHelper.cloneBranch(repository, repository_owner, prObject.ref, () => {
            TestRunner.installDependenciesRunTests(prObject.ref, () => {
                prBranchCloneTest();
            });
        })
    }
};

/**
 * Generate  comprehensive unit test coverage reports for the specified repo
 * @param {string} repo
 * @param {string} owner
 * @param {string} basebranch
 * @return {void}
 */
module.exports = (repo, owner, basebranch) => {
    repository = repo;
    repository_owner = owner;

    // Clone base branch and run unit tests for coverage
    GitHelper.cloneBranch(repository, repository_owner, basebranch, () => {
        TestRunner.installDependenciesRunTests(basebranch, () => {
            
            // Fetch all the opened PRs on the basebranch
            GitHelper.fetchOpenPRs(repo, owner, basebranch, (prsList) => {
                openedPRs = prsList;
                prBranchCloneTest();
            })
        });
    });

    
};