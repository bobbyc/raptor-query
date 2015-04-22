require('console.table');

var Series = require('.//influx/series.js');

/**
 * Constructor - Matrix
 * @param err
 * @param result
 */
var Matrix = function(name) {
    this.name = name || 'Matrix';
    this.matrix = [];
    this.series = new Series;
}

/**
 * Callback function for influxdb.query.
 * Collecting app startup time against each branch
 * @param err
 * @param result
 */
Matrix.prototype.callback = function (err, result) {
}

/**
 * Show matrix as table
 */
Matrix.prototype.show = function() {
  console.table(this.name, this.matrix);
}

// module.exports
module.exports = Matrix;



