
module.exports = function (server, mountpoint, User) {

    var Handler = new (require('hapi-mongoose-handler'))({model: User});

    server.route({
        method: "GET",
        path: mountpoint + '/users',
        config: {
            handler: Handler.find()
        }
    });

    server.route({
        method: "POST",
        path: mountpoint + '/users',
        config: {
            handler: Handler.create()
        }
    });

    server.route({
        method: "GET",
        path: mountpoint + '/users/{_id}',
        config: {
            handler: Handler.findOne()
        }
    });

    server.route({
        method: "PUT",
        path: mountpoint + '/users',
        config: {
            handler: Handler.update()
        }
    });

    server.route({
        method: "DELETE",
        path: mountpoint + '/users/{_id}',
        config: {
            handler: Handler.delete() // jshint ignore:line
        }
    });

};

