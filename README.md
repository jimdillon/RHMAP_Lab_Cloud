# Red Hat Mobile Lab Cloud App

We'll take the blank 'hello world' cloud App and use it to get the temperature for the passed in city and state.



### Start with the default Hello World cloud App.

* Swap the /hello route for a /weather route.

### We'll tell Express to send requests to /weather to our index.js file in lib.
(If no file is specified for the folder, node defaults to index.js).

To do this we'll change application.js from this
```Javascript
app.use('/hello', require('./lib/hello.js')());
```
To this _(make sure you remove the extra parenthesis after require('./lib'))_
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
* The MBaaS API has been updated so we'll update our package.json file to reflect this

Change
```
"fh-mbaas-api": "~4.11.0",
```
To
```
"fh-mbaas-api": "~5.0.0",
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
* Don't forget to add the WEATHER_SERVICE_MBAAS_GUID to the Gruntfile.js in the env.local section
![alt tag](https://raw.github.com/jimdillon/RH-MAP-Tech-Talk-Lab/master/weatherserviceguid.jpg)
```
WEATHER_SERVICE_MBAAS_GUID: 'Your MBaaS GUID AKA Service ID on the Details page',
```
* We also need to tell the Cloud App to find our MBaaS running locally at 127.0.0.1:8002, this will go in the Gruntfile.js too.  Place it in the serviceMap variable
```
var serviceMap = {
            'wt6tpsyhol7rpw2lfxertrxg': 'http://127.0.0.1:8002',
            'SERVICE_GUID_2': 'https://host-and-path-to-service'
          };
```

* Now, lets make our function to call the MBaaS _(in index.js)_

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
* Let's start up the Cloud App with grunt _(if using linux you made need to run this with sudo)_
```
grunt serve:local
```

* Our Cloud App should now be utilizing our MBaaS to connect to the geocoding and weather services to provide the current temperature for the city and state input.


### Weather API
Temperature endpoint
## /weather/temperature/:city/:state [GET]
