//
// nodeunit tests
//
var BranchMatrix = require('../../lib/branch-matrix.js')
var AppMatrix = require('../../lib/apps-matrix.js')
var SeriesMatrix = require('../../lib/series-matrix.js')

exports.testQueryBranch = function(test){

	var m = new BranchMatrix('coldlaunch.visuallyLoaded');
	process.on('exit', m.show.bind(m));
	m.query(['master', 'v2.2']);
    test.done();

};

exports.testQueryApps = function(test){

    var m = new AppMatrix;
    process.on('exit', m.show.bind(m));
    m.query();
    test.done();

};

exports.testQuerySerieses = function(test){

    serieses = ['coldlaunch.navigationLoaded', 
                'coldlaunch.visuallyLoaded', 
                'coldlaunch.fullyLoaded'
    ];

    branches = ['v2.2'];
    apps = [    "Calendar", "Camera", "Clock", "Contacts", "E-Mail", 
                "FM Radio", "Gallery", "Messages", "Music", "Phone", 
                "Settings","Video"];


    var m = new SeriesMatrix;
    process.on('exit', m.show.bind(m));
    m.query(serieses, branches, apps);
    test.done();

};

