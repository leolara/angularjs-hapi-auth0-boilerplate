
module.exports = function (server, mountpoint, Message, acl) {

    var Handler = new (require('../../server/simpleCRUD'))({model: Message});

    // List all messages, no authentication needed
    server.route({
        method: 'GET',
        path: mountpoint + '/messages',
        config: {
            handler: Handler.list
        }
    });

    server.route({
        method: 'POST',
        path: mountpoint + '/messages',
        config: {
            handler: acl.hapiAllowed('messages', 'create', Handler.create),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'GET',
        path: mountpoint + '/messages/{_id}',
        config: {
            handler: Handler.read
        }
    });

    server.route({
        method: 'PUT',
        path: mountpoint + '/messages',
        config: {
            handler: acl.hapiAllowed('messages', 'update', Handler.update),
            auth: 'auth0'
        }
    });

    server.route({
        method: 'DELETE',
        path: mountpoint + '/messages/{_id}',
        config: {
            handler: acl.hapiAllowed('messages', 'delete', Handler.delete), // jshint ignore:line
            auth: 'auth0'
        }
    });

};
