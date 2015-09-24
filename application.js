'use strict';
var mbaasApi = require('fh-mbaas-api')
, express = require('express')
, mbaasExpress = mbaasApi.mbaasExpress()
, log = require('fhlog').get('Express')
, app = express()
, cors = require('cors');

app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// fhlint-begin: custom-routes
app.use('/weather', require('./lib'));
// fhlint-end

mbaasExpress.errorHandler()

app.use(function errorHandler (err, req, res, next) {
  log.e('Received error: %s', err);
  log.e(err.stack);

  res.send(500, 'Internal Server Error');
});

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
