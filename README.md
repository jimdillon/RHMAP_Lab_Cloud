# Red Hat Mobile Lab Cloud App

We'll take the blank 'hello world' cloud App and use it to get the temperature for the passed in city and state.



### Start with the default Hello World cloud App.
* Swap the /hello route for a /weather route.
### We'll tell Express to send requests to /weather to our index.js file in lib.
(If no file is specified for the folder, node defaults to index.js).

To do this we'll change this
```Javascript
app.use('/hello', require('./lib/hello.js')());
```
To this
```Javascript
app.use('/weather', require('./lib'));
```
* Rename hello.js to index.js and remove all contents
* We want to handle temperature requests to /weather/temperature/:city/:state
so we'll need to tell express how to get those requests to our function(s) that
will handle them.  We'll need express, bodyParser and cors.  We also need to
instantiate the Express router and export our routes.  Let's add a good opensource
logger to the mix too, it might come in handy.
```Javascript
var express = require('express')
  , bodyParser = require('body-parser')
  , log = require('fhlog').get('cloud')
  , route = module.exports = new express.Router();
```
* We need to use bodyParser to parse incoming requests and we need to tell Express
how to route requests to /weather/temperature/:city/:state, we'll send them to
a function called doGetTemp for now.
```Javascript
route.use(bodyParser.json());

route.get('/temperature/:city/:state', doGetTemp);
```
* Let's write the doGetTemp function, it will check for all necessary in put and
send back a json object with a dummy temperature.
```Javascript
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
```
* We need to alter our package.json file to include the fhlog npm module
```
"fhlog": "^0.12.1"
```
* Install the node modules
```
npm i
```
* Start the cloud app
```
grunt serve
```
* Check that all is good by typing the following into your browser.
http://127.0.0.1:8001/weather/temperature/Richmond/VA

### Now we'll create our WeatherService and come back later to alter our Cloud App to utilize the new MBaaS.

### So your MBaaS is built, and tested, congratulations.
* We'll simply alter our route to use a new function that calls the MBaaS and returns the temperature to the client.

We'll use an Environmental variable to hold the GUID of our MBaaS and we'll need the fh-mbaas-api too
```Javascript
var express = require('express')
  , bodyParser = require('body-parser')
  , log = require('fhlog').get('cloud')
  , route = module.exports = new express.Router();
```
To This
```Javascript
var weatherServiceGUID = process.env.WEATHER_SERVICE_MBAAS_GUID
, express = require('express')
  , bodyParser = require('body-parser')
  , log = require('fhlog').get('cloud')
  , service = require('fh-mbaas-api').service
  , path = require('path')
  , route = module.exports = new express.Router();
```
* Now, lets make our function to call the MBaaS

```Javascript
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
```
* Let's change our route to use the new function
```Javascript
route.get('/temperature/:city/:state', doGetTemp);
```
To
```Javascript
route.get('/temperature/:city/:state', doGetTempFromService);
```

* Our Cloud App should now be utilizing our MBaaS to connect to the geocoding and weather services to provide the current temperature for the city and state input.


### Temperature API

### /weather/temperature/:city/:state [/weather/temperature/:city/:state]

Temperature endpoint
## /weather/temperature/:city/:state [GET]

+ Request (application/json)
    + Body
            {}
+ Response 200 (application/json)
    + Body
            {}
