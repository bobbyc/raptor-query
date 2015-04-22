require('console.table');

var influx = require('influx');

/**
 * Constructor - Series for InfluxDB
 * Collecting app metadata in a branch
 * @param err
 * @param result
 */
var Series = function(name, appName, branch) {
    this.name = name || 'coldlaunch.visuallyLoaded';
    this.appName = appName || 'Calendar';
    this.branch = branch || 'master';

	// influxdb querier
	this.client = influx({
		host: process.env.RAPTOR_HOST || 'localhost',
		port: process.env.RAPTOR_PORT || 8086,
		username: process.env.RAPTOR_USERNAME || 'root',
		password: process.env.RAPTOR_PASSWORD || 'root',
		database: process.env.RAPTOR_DATABASE || 'raptor'
	});

}

/**
 * Query series data by branch and appName
 * Collecting app metadata in a branch
 * @param err
 * @param result
 */
Series.prototype.query = function(callback, branch, appName, counts) {

    if ( callback == undefined ||
         callback == null) {

        console.out('invaild query callback for database!');
    }


    // check default values
    branch = branch || this.branch;
    appName = appName || this.appName;
    counts = counts || 1 ;

    query = "select * from " + this.name + 
            " where appName = '" + appName + "' and branch = '" + branch + "' limit " + counts.toString();        

    this.client.query(query, callback);  
}

//
// Declare exports
//
module.exports = Series;

