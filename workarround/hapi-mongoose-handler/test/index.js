var Hapi = require('hapi'),
    Mongoose = require('mongoose'),
    Handler = require('../lib'),
    Schema = Mongoose.Schema,
    Expect = require('chai').should(),
    server = null,
    testModel = null;

before(function(done) {

    var testSchema = new Schema({
        start: {
            type: Date,
            required: true
        },
        field1: "String",
        field2: "String"
    });

    testModel = Mongoose.model('test', testSchema);
    server = new Hapi.Server(0);


    Mongoose.connect("mongodb://127.0.0.1:27017/test", function() {
        done();
    });

});

describe('testing something\'s api', function() {
    var id = null;
    before(function(){
        var SomeHandler = new Handler({
            model: testModel
        });

        var routes = [{
                method: "POST",
                path: "/something",
                config: {
                    handler: SomeHandler.create(),
                }
            }, {
                method: "PUT",
                path: "/something/{_id}",
                config: {
                    handler: SomeHandler.update(),
                }
            }, {
                //use the param _id to delete by
                method: "DELETE",
                path: "/something/{_id}",
                config: {
                    handler: SomeHandler.delete()
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

        server.route(routes);
    });


    it(' create a new something', function(done) {

        var payload = {
            start: new Date(),
            field1: "stuff",
            field2: "fluff"
        };


        server.inject({method: 'POST', url: '/something', payload: payload }, function(res) {
            res.statusCode.should.equal(200);
            res.result.field1.should.equal('stuff');
            res.result.field2.should.equal('fluff');
            id = res.result._id;
            done();
        });
    });

    it('should get  a new something', function(done) {

        server.inject({method: 'GET', url: '/something/'+ id}, function( res) {
            res.statusCode.should.equal(200);
            res.result.field1.should.equal('stuff');
            res.result.field2.should.equal('fluff');
            done();
        });
    });

    it('should update something', function(done) {
   
        var payload = {
            field1: "new stuff"
        };

        server.inject({method: 'put', url: '/something/'+ id, payload: payload}, function( res) {
            res.statusCode.should.equal(200);
            res.result.field1.should.equal('new stuff');
            res.result.field2.should.equal('fluff');
            done();
        });
    });

    it('should delete something', function(done) {
        server.inject({method: 'delete', url: '/something/'+ id}, function( res) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});


describe('testing check function', function() {
    var id = null;
    before(function(){
        var SomeHandler = new Handler({
            model: testModel,
            check: function(model, request, action){
                return request.payload.field2 == "same" || action == "delete";
            }
        });

        var routes = [{
                method: "POST",
                path: "/something2",
                config: {
                    handler: SomeHandler.create(),
                }
            }, {
                method: "PUT",
                path: "/something2/{_id}",
                config: {
                    handler: SomeHandler.update(),
                }
            }, {
                //use the param _id to delete by
                method: "DELETE",
                path: "/something2/{_id}",
                config: {
                    handler: SomeHandler.delete()
                }
            }, {
                //use the param _id + queryString to find by
                method: "GET",
                path: "/something2/{_id}",
                config: {
                    handler: SomeHandler.findOne()
                }
            }, {
                //uses the queryString querystring to search
                method: "GET",
                path: "/somethings2/",
                config: {
                    handler: SomeHandler.find()
                }
            }
        ];

        server.route(routes);
    });


    it(' create a new something', function(done) {

        var payload = {
            start: new Date(),
            field1: "stuff",
            field2: "fluff"
        };


        server.inject({method: 'POST', url: '/something2', payload: payload }, function(res) {
            res.statusCode.should.equal(200);
            res.result.field1.should.equal('stuff');
            res.result.field2.should.equal('fluff');
            id = res.result._id;
            done();
        });
    });

    it('not update something', function(done) {
   
        var payload = {
            field1: "hot stufff",
            field2: "not same"
        };

        server.inject({method: 'put', url: '/something2/'+ id, payload: payload}, function( res) {
            res.statusCode.should.equal(401);
            done();
        });
    });

    it('should update something', function(done) {
   
        var payload = {
            field1: "new stuff",
            field2: "same"
        };

        server.inject({method: 'put', url: '/something2/'+ id, payload: payload}, function( res) {
            res.statusCode.should.equal(200);
            res.result.field1.should.equal('new stuff');
            res.result.field2.should.equal('same');
            done();
        });
    });



    it('should delete something', function(done) {
        server.inject({method: 'delete', url: '/something2/'+ id}, function( res) {
            res.statusCode.should.equal(200);
            done();
        });
    });
});


describe('testing events', function() {

    it('create event', function(done) {

        var payload = {
            start: new Date(),
            field1: "stuff",
            field2: "fluff"
        };

        server.on('createTest', function(model){
            id = model._id;
            done();
        });
        server.inject({method: 'POST', url: '/something', payload: payload }, function(res) {
        });
    });

    it('update event', function(done) {
   
        var payload = {
            field1: "new stuff"
        };

        server.on('updateTest', function(model){
            done();
        });

        server.inject({method: 'put', url: '/something/'+ id, payload: payload}, function( res) {
        });
    });

    it('delete event', function(done) {

        server.on('deleteTest', function(model){
            done();
        });

        server.inject({method: 'delete', url: '/something/'+ id}, function( res) {
        });
    });

});
