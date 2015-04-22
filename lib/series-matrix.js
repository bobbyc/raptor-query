var Series = require('./influx/series.js');
var Matrix = require('./matrix.js');
var debug = require('debug');

/**
 * Constructor - SeriesMatrix
 * @param err
 * @param result
 */
var SeriesMatrix = function(name) {

    //call parent constructor
    Matrix.call(this, name);
}

// create prototype from parent class
SeriesMatrix.prototype = Object.create(Matrix.prototype);

// Set the "constructor" property
SeriesMatrix.prototype.constructor = SeriesMatrix;

/**
 * Query designed matrix data
 * Collecting app startup time against each branch
 * @param err
 * @param result
 */
SeriesMatrix.prototype.query = function(serieses, branches, apps) {

    // check default values
    serieses = serieses || ['coldlaunch.visuallyLoaded'];
    branches = branches || ['master'];
    apps = apps || [  "Calendar", "Camera", "Clock", "Contacts", "E-Mail", 
                    "FM Radio", "Gallery", "Messages", "Music", "Phone", 
                    "Settings","Video"];


    // loop to query matrix
    for (series in serieses)
    {
        s = new Series(serieses[series]);
        for (b in branches)
        {
            for (a in apps) {
                s.query(this.callback.bind(this), branches[b], apps[a]);
            }
        }
    }
}

/**
 * Callback function for influxdb.query.
 * Collecting app startup time against each branch
 * @param err
 * @param result
 */
SeriesMatrix.prototype.callback = function (err, result) {

    if (err) {
        debug('Error writing report results to database: %j', err);
        return reject(err);
    }

    // Associate columns and value of point into array
    var iAppName = result[0].columns.indexOf('appName');
    var iValue = result[0].columns.indexOf('value')

    // find appName row in table
    var found = false;
    for (r in this.matrix) {
        if ( this.matrix[r]['series'] == result[0].name) {
            this.matrix[r][result[0].points[0][iAppName]] = result[0].points[0][iValue];
            found = true;
            break;
        }
    }

    //
    // add new appName row in table
    //
    // ----------------------------------------------------------------------
    // series                       Video  Gallery  E-Mail  Music  Settings  
    // ---------------------------  -----  -------  ------  -----  --------  
    // coldlaunch.visuallyLoaded    1018   1023     1911    1055   2418      
    // coldlaunch.navigationLoaded  593    600      1901    573    1317      
    // coldlaunch.fullyLoaded       1362   1814     1911    1553   5172      

    if ( !found ) {
        var assoc = [];
        assoc['series'] = result[0].name;
        assoc[result[0].points[0][iAppName]] = result[0].points[0][iValue];
        this.matrix.push(assoc);
    }
}

// module.exports
module.exports = SeriesMatrix;