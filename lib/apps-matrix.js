var Series = require('./influx/series.js');
var Matrix = require('./matrix.js');
var debug = require('debug');

/**
 * Constructor - AppsMatrix
 * @param err
 * @param result
 */
var AppsMatrix = function(name) {

    //call parent constructor
    Matrix.call(this, name);

}

// create prototype from parent class
AppsMatrix.prototype = Object.create(Matrix.prototype);

// Set the "constructor" property
AppsMatrix.prototype.constructor = AppsMatrix;

AppsMatrix.prototype.query = function(apps, branches) {

    // check default values
    apps = apps || [  "Calendar", "Camera", "Clock", "Contacts", "E-Mail", 
                    "FM Radio", "Gallery", "Messages", "Music", "Phone", 
                    "Settings","Video"];
    branches = branches || ['master'];

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
AppsMatrix.prototype.callback = function(err, result) {

  var cols = [ "appName", "value", "memory", "device", "branch", "context" ];

  if (err) {
    debug('Error writing report results to database: %j', err);
    return reject(err);
  }

  //
  // Associate columns and value of point into array
  //
  // ------------------------------------------------------------------------
  // appName   value  memory  device    branch  context
  // --------  -----  ------  --------  ------  -----------------------------
  // Messages  2806   319     flame-kk  master  sms.gaiamobile.org
  // Video     2818   319     flame-kk  master  video.gaiamobile.org
  // FM Radio  2302   319     flame-kk  master  fm.gaiamobile.org
  // Music     2887   319     flame-kk  master  music.gaiamobile.org
  // Gallery   2848   319     flame-kk  master  gallery.gaiamobile.org
  // E-Mail    2284   319     flame-kk  master  email.gaiamobile.org
  // Settings  4480   319     flame-kk  master  settings.gaiamobile.org
  // Phone     2508   319     flame-kk  master  communications.gaiamobile.org
  // Clock     2972   319     flame-kk  master  clock.gaiamobile.org
  // Contacts  2431   319     flame-kk  master  communications.gaiamobile.org
  // Camera    3107   319     flame-kk  master  camera.gaiamobile.org
  // Calendar  1592   319     flame-kk  master  calendar.gaiamobile.org
  var assoc = [];
  for(i in cols) {
      var col_idx = result[0].columns.indexOf(cols[i]);
      assoc[result[0].columns[col_idx]] = result[0].points[0][col_idx];
  }

  this.matrix.push(assoc);
}

// module.exports
module.exports = AppsMatrix;