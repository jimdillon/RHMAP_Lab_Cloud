# Red Hat Mobile Lab Cloud App

We'll take the blank 'hello world' cloud App and use it to get the temperature for the passed in city and state.

### Temperature API

### /weather/temperature/:city/:state [/weather/temperature/:city/:state]

Temperature endpoint
## /weather/temperature/:city/:state [GET]

+ Request (application/json)

+ Response 200 (application/json)
    + Body
            {}

### Steps
### Start with the default 'Hello World' cloud App.
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
