
# Boilerplate with AngularJS, Auth0 and Node/Hapi

## Features

 + Front-end application based on AngularJS
 + Back-end application based on Node Hapi framework and Mongoose
 + Front-end dependencies based on Bower
 + Back-end dependencies based on npm
 + Grunt based build system
 + Front-end tests based on Jasmine and PhantomJS
 + Back-end tests based on Tape
 + Authentication using Auth0 system on the front-end
 + Back-end authentication based on JWT passed from the front-end
 + Back-end ACL using node_acl
 + Two example APIs, users and messages
 + All configuration can be done by environment variables, and can be deployed on Heroku

## Auth0 set-up

It is very important to keep in mind that you should add any domain from which you are trying
to authenticate to Auth0 callbacks. This is done in App settings, "Allowed Callback URLs". An example of what you can have there:

```
http://localhost:8000/, http://stark-hollows-6132.herokuapp.com/, https://stark-hollows-6132.herokuapp.com/
```

Otherwise, the authentication will fail. From App settings in Auth0 dashboard you will also need 3 variables to configure the system:
 + Domain
 + Client Id
 + Client Secret


## Development environment set-up and workflow

### Source code and dependencies
First clone this repo and install dependencies, but before set up a blank database for tests.

```
git clone https://github.com/leolara/angularjs-hapi-auth0-boilerplate.git boilerplate

cd boilerplate

export mongodb_testUri="mongodb://localhost/tests"

npm install
```

After this, you will have all dependencies installed, including front-end dependencies as npm will call bower.
Also the tests are run, they might fail if you didn't set up correctly ``mongodb_testUri``` environment var.

### Environment

You should set up four environment variables in order to run the grunt build system and the Hapi server.

```
export auth0_domain="yyygdljsagskljhsakhasdkhsadkhkdashksdah"
export auth0_clientId="asghdasjd"
export auth0_clientSecret="ajlhsa
export mongodb_uri="mongodb://192.168.59.103:49153/boilerplate"
export mongodb_testUri="mongodb://192.168.59.103:49153/tests".auth0.com"
```

### Build client in development mode

In one console with the environment set-up, run:

```
grunt watch
```

This will build the client and rebuild it if you change it.

### Start Hapi server

On a different console, and with the environment set-up as well, run:

```
node server/server.js
```

The script should show where the server is listening. You should enter in ```/build``` where the development client is mounted.

### Running tests and linting

To run tests:

```
grunt test
```

This will run both, client and server side tests.

To run the linter:

```
grunt jshint
```

## Deploying production to Heroku

To deploy to heroku, it is like any other Node app, just push the code. The only thing to remember isto set up the enviroment variable in herku.

```
heroku config:set auth0_domain="yyygdljsagskljhsakhasdkhsadkhkdashksdah"
heroku config:set auth0_clientId="asghdasjd"
heroku config:set auth0_clientSecret="ajlhsa
heroku config:set mongodb_uri="mongodb://192.168.59.103:49153/boilerplate"
```

The scripts are set up, so Heroku will automatically install all dependencies and build the client application.
