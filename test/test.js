'use strict';

var expect = require('chai').expect;
var comprehensiveJSCoverage = require('../src/index');

describe('#comprehensiveJSCoverage', function() {
    it('should fetch repo contents', function() {
        var repo_name = 'string-titlecase';
        var repo_owner = 'zeezia';
        var result = comprehensiveJSCoverage(repo_name, repo_owner);
        // expect(result).to.equal('1');
    });
});