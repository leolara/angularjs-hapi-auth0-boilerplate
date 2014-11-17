
var ACL = require('acl');
var Boom = require('boom');

module.exports = function (server, db) {
    acl = new ACL(new ACL.mongodbBackend(db.mongodb, 'acl_'));

    // TODO: move ACL to REST API instead of hardcoding here
    acl.allow('admin', 'users', '*');

    acl.allow('admin', 'messages', '*');

    acl.allow('stduser', 'messages', 'list');
    acl.allow('stduser', 'messages', 'create');
    acl.allow('stduser', 'messages', 'read');
    acl.allow('stduser', 'messages', 'update');
    acl.allow('stduser', 'messages', 'delete');

    acl.hapiAllowed = function (resource, permission, handler) {
        return function (req, reply) {
            var userId = req.auth.credentials._id;
            acl.isAllowed(userId.toString(), resource, permission, function (err, allowed) {
                if (err) {
                    server.log(['acl', 'error'], err);
                    return reply(Boom.badImplementation());
                }
                if (allowed) {
                    server.log(['acl', 'permission'], 'User ' + userId + ' has ACL permission ' + permission + ' for ' + resource);
                    return handler(req, reply);
                }
                server.log(['acl', 'permission'], 'User ' + userId + ' has NOT ACL permission ' + permission + ' for ' + resource);
                return reply(Boom.unauthorized());
            });
        };
    };

    return acl;
};
