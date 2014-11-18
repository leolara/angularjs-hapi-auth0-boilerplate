
// Load configuration
var nconf = require('nconf');
nconf.argv().env('_');
nconf.file({file: 'config/server.json'});

// Create Hapi server
var Hapi = require('hapi');
var server = new Hapi.Server(process.env.PORT || nconf.get('server:port'));

// Logging system
require('./boot/good')(server);

// Serve static files
require('./boot/static')(server);

// Set up DB and models
var db = require('./boot/db')(nconf, false, function (err, db) {
    var acl = require('./boot/acl')(server, db);

    require('./boot/auth0')(server, nconf, db.models.User, acl, function (err) {

        if (err) {
            server.log(['auth0', 'error'], err);
            return;
        }

        var defaultHandler = function (request, reply) {
            reply('success');
        };

        server.route({method: 'GET', path: '/testauth', handler: defaultHandler, config: {auth: 'auth0'}});

        require('./api')(server, db, acl);

        server.start(function () {
            server.log(['server'], 'Server started at: ' + server.info.uri);
        });
    });
});
