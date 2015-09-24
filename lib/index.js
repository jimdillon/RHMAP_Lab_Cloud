'use strict';
var weatherServiceGUID = process.env.WEATHER_SERVICE_MBAAS_GUID
, express = require('express')
  , bodyParser = require('body-parser')
  , log = require('fhlog').get('cloud')
  , service = require('fh-mbaas-api').service
  , path = require('path')
  , route = module.exports = new express.Router();

route.use(bodyParser.json());

route.get('/temperature/:city/:state', doGetTemp);

function doGetTemp(req, res) {
  if(!req.params.city || !req.params.state) {
    log.d('city or state missing');
    res.json(400, {
      message: 'Please provide city and state input.'
    });
  } else {
    log.d('Sending back dummy temp of 90');
    res.json({temperature: 90});
  }
}

function doGetTempFromService(req, res) {
  if(!req.params.city || !req.params.state) {
    res.json(400, {
      message: 'Please provide city and state input.'
    });
  } else {
    log.d('weatherServiceGUID %s', weatherServiceGUID);
    service({
      guid: weatherServiceGUID,
      path: path.join('/weather-service/temperature', req.params.city, req.params.state),
      method: 'GET'
    }, function(err, body, serviceResponse) {
      if (err) {
        log.d('Error %s', err);
        res.json(400, {
          message: 'Error contacting Weather Service'
        });
      } else {
        log.d('Temperature returned from MBaaS is %s', body.temperature);
        res.json({temperature: body.temperature});
      }
    });
  }
}
