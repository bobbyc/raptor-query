var Series = require('.//influx/series.js');
var Matrix = require('./matrix.js');
var debug = require('debug');

/**
 * Constructor - BranchMatrix
 * @param err
 * @param result
 */
var BranchMatrix = function(name) {

    //call parent constructor
    Matrix.call(this, name);
}

// create prototype from parent class
BranchMatrix.prototype = Object.create(Matrix.prototype);

// Set the "constructor" property
BranchMatrix.prototype.constructor = BranchMatrix;

/**
 * Query designed matrix data
 * Collecting app startup time against each branch
 * @param err
 * @param result
 */
BranchMatrix.prototype.query = function(branches, apps) {

    // check default values
    branches = branches || ['master'];
    apps = apps || [  "Calendar", "Camera", "Clock", "Contacts", "E-Mail", 
                    "FM Radio", "Gallery", "Messages", "Music", "Phone", 
                    "Settings","Video"];

    // loop to query matrix
    for (b in branches)
    {
        for (a in apps) {
            series = new Series(undefined, apps[a], branches[b]);
            series.query(this.callback.bind(this));
        }
    }

}

/**
 * Callback function for influxdb.query.
 * Collecting app startup time against each branch
 * @param err
 * @param result
 */
BranchMatrix.prototype.callback = function (err, result) {

    if (err) {
        debug('Error writing report results to database: %j', err);
        return reject(err);
    }

    //
    // Associate columns and value of point into array
    //
    // -------------------------
    // appName   master  v2.2
    // --------  ------  ----
    // Video     2818    1018
    // Messages  2806    986
    // Gallery   2848    1023
    // Settings  4480    2418
    // Music     2887    1055
    // E-Mail    2284    1911
    // FM Radio  2302    485
    // Phone     2508    676
    // Clock     2972    1136
    // Camera    3107    1467
    // Contacts  2431    640
    // Calendar  1592    1342

    var iAppName = result[0].columns.indexOf('appName');
    var iBranch = result[0].columns.indexOf('branch')
    var iValue = result[0].columns.indexOf('value')

    // find appName row in table
    var found = false;
    for (row in this.matrix) {
        if ( this.matrix[row][result[0].columns[iAppName]] == result[0].points[0][iAppName]) {
            this.matrix[row][result[0].points[0][iBranch]] = result[0].points[0][iValue];
            found = true;
            break;
        }
    }

    // add new appName row in table
    if ( !found ) {
        var assoc = [];
        assoc[result[0].columns[iAppName]] = result[0].points[0][iAppName];
        assoc[result[0].points[0][iBranch]] = result[0].points[0][iValue];
        this.matrix.push(assoc);
    }
}

// module.exports
module.exports = BranchMatrix;