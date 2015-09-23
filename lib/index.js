'use strict';
var weatherServiceGUID = process.env.weatherServiceID
, express = require('express')
  , bodyParser = require('body-parser')
  , log = require('fhlog').get('temperature')
  , service = require('fh-mbaas-api').service
  , path = require('path')
  , request = require('request');

var route = module.exports = new express.Router();

route.use(bodyParser.json());

route.get('/temperature/:city/:state', doGetTempLikeService);

function doGetTemp(req, res) {
  if(!req.params.city || !req.params.state) {
    res.json(400, {
      message: 'Please provide city and state input.'
    });
  }
  else {
    res.json({temperature: 90});
  }
}

function doGetTempFromService(req, res) {
  service({
    guid: weatherServiceGUID,
    path: path.join('/weatherService/temperature'),
    method: 'GET'
  }, function(err, body, res) {
    if (err) {
      next(err);
    } else {
      res.json(body);
    }
  });
}

function doGetTempLikeService(req, res) {
  if(!req.params.city || !req.params.state) {
    res.json(400, {
      message: 'Please provide city and state input.'
    });
  }
  else {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    + 'address=' + req.params.city + ',+' + req.params.state +'&key=AIzaSyAODZKRyqnv7fOsiJRUyTg5nTAsz1obNtQ';
    request(url, function(err, response, body) {
      if(err) {
        res.json(500, {message: 'Geocoding Service did not respond positively'});
      }
      var lat = '';
      var lng = '';
      try {
        lat = JSON.parse(body).results[0].geometry.location.lat;
        lng = JSON.parse(body).results[0].geometry.location.lng;
      }
      catch(e) {
        res.json(500, {message: 'Geocoding Service did not respond appropriately'});
      }
      log.d('lat %s lng %s', lat, lng);
      res.json({lat: lat, lng: lng});
    });
  }
}