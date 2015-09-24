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
express = require('express')
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
