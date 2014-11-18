hapi-mongoose-handler [![Build Status](https://travis-ci.org/craveprogramminginc/hapi-mongoose-handler.png?branch=master)](https://travis-ci.org/craveprogramminginc/hapi-mongoose-handler)
=====================

- Easly turn your mongoose models into a RESTful API. 
- Converts mongoose validation errors to 402's with an appropriate error message
- Trys to follow hapi's configuration centric stlye

Install
=======
`npm install hapi-mongoose-handler`  
Or  
`git clone https://github.com/craveprogramminginc/hapi-mongoose-handler && cd hapi-mongoose-handler`  
Then Build  
`coffee -o lib/ -c src/`


Example
=======

```javascript
var Hapi    = require('hapi');

//fist we need to require this package :P
var Handler = require('hapi-mongoose-handler');

//2) we need a mongoose model
var SomeModel = require('path/to/model');

//3) we create a new generic handler with the prevous model
var SomeHandler = new Handler({
  model: SomeModel
});

//4) create some routes for hapi and use the method provided by the handler we created
var routes = [
  {
    method: "POST",
    path: "/something",
    config: {
      handler: SomeHandler.create(),
      auth: true
    }
  }, {
    //use the param _id to delete by
    method: "DELETE",
    path: "/something/{_id}",
    config: {
      handler: SomeHandler.delete(),
      auth: true
    }
  }, {
    //use the param _id + queryString to find by
    method: "GET",
    path: "/something/{_id}",
    config: {
      handler: SomeHandler.findOne()
    }
  }, {
    //uses the queryString querystring to search
    method: "GET",
    path: "/somethings/",
    config: {
      handler: SomeHandler.find()
    }
  }
];

Hapi.routes(routes);
```

Referance
=========
## new Handler([options])
Create a new instance of hapi-mongoose-handler. 
### Options
The following options are valid.

- `model` - the mongoose model we want to create an API for
- `config`  
  - `maxLimit` - the max number of results to return
  - `defaultOrder` the order of the results if no `order` is specified in the query
- `fields` - hash of fields that will be saved to the model. Used by `create` and `update` Each field can have the following option
  - `validate` - a function that is given the field value, `params` and  `request` and returns a string if invalid else return null
  - `transform` - a function that is given the field value, `params` and  `request` and returns the new value for the field
  -  `rename` - a string that the field is renamed to before saving
  - function - if only a function is given it is use a the `transform` option
- `queries` - the same as fields except used to query mongo. Used by `update`, `delete`, `find` and `findOne`. The values come from the querystring.
- `check` - a function that is given the `model` and the `request`, return a true/false determining whether to modify the model, runs on `update`, `delete`  
- `omit` - an array of fields to omit
- `after` - a function that runs after the model as been found or modified. It is given the results of the mongoose query and the `request` object. Whatever you return will be the response. You can use this to wrap or modify the results from mongo. 

### Methods
theses are the method attached to handler instance. Each of the function take a options hash with the same option as the contructor. This enables you to overload the option for each individual handler
- `create` create a document using the payload from the request
- `find` find documents using the querystring to search by
- `findOne` find one document using the querystring ORed with request.param as the condition parameter
- `delete` delete one  document using the querystring ORed with request.param as the condition parameter

### Events
Adds the following events to hapi's [server](https://github.com/spumko/hapi/blob/master/docs/Reference.md#hapiserver) object
- `create` - emits an event on creation of a model that is the concatenation of create and the model name with the first letter capitilized. For example if you had a model name `dog` when you created a new `dog` the event would be `createDog`
- `update` - emits an event on the modification of a model that is the same format as create
- `delete` - emits an event on the deletation of a model that is the same format as create

Examples
========

Lets add some field to transfrom to the first example

```javascript
//3) we create a new generic handler with the prevous model
var SomeHandler = new Handler({
  model: SomeModel,
  fields: {
      //someFieldVal comes from request.params.someField
      someField: function(someFieldVal, params, request){
        //return a new value for the field
        return "Cadaverously Quaint ";
      }
  }
});
```

Here is how you would add some extra validation
```javascript
//3) we create a new generic handler with the prevous model
var SomeHandler = new Handler({
  model: SomeModel,
  fields: {
      //someFieldVal comes from request.params.someField
      someField:{
        transform: function(someFieldVal, params, request){
        //return a new value for the field
        return "Cadaverously Quaint";
        },
        //validation run after traform, so this will also return true
        validate: function(someFieldVal, params, request){
          //if false hapi will return a 401 error with a error message for someField
          return someFieldVal == "Cadaverously Quaint";
        }
      }
  }
});
```

If you want to overload an individual handler.

```javascript
//3) we create a new generic handler with the prevous model
var SomeHandler = new Handler({
  model: someModel
});


var routes = [{
    method: "POST",
    path: "/something",
    config: {
      //create will now act on someThingElse instead of someModel 
      handler: SomeHandler.create({
        model: someThingElse,
     })
    }
}];
```

More Examples
=============
- [MetaGeo's event controller](https://github.com/craveprogramminginc/metageo-core/blob/master/controllers/eventController.coffee)
- [MetaGeo's user controller](https://github.com/craveprogramminginc/metageo-core/blob/master/controllers/userController.coffee)
- [MetaGeo's list controller](https://github.com/craveprogramminginc/metageo-core/blob/master/controllers/listController.coffee)


Tests
=====
Tests are written in mocha
To run tests `npm test`

FAQs
====
### So this shit is broken, now what?
please open an [issue](https://github.com/craveprogramminginc/hapi-mongoose-handler/issues).

### Can I have X ?
please open an [issue](https://github.com/craveprogramminginc/hapi-mongoose-handler/issues).

### uhmm its written in coffeesccript and that not 'what the gods intended'
Diversity is good, stop being a racist and join the pagan dance circle 

### Why am I using mongoose in the first place?
I don't know and thats beyond the scope of this project.
  
