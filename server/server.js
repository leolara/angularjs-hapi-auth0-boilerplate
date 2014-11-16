
var Hapi = require('hapi');
var server = new Hapi.Server('localhost', 8000);

var nconf = require('nconf');

nconf.argv().env('_');

nconf.file({file: 'config/server.json'});

// Logging system
require('./boot/good')(server);

// Serve static files
require('./boot/static')(server);

// Set up DB and models
var db = require('./boot/db')(nconf, true);

// Set up authentication and then start server
require('./boot/auth0')(server, config, db.models.User, function (err) {

    if (err) {
        server.log(['auth0', 'error'], err);
        return;
    }
    var defaultHandler = function (request, reply) {
        reply('success');
    };

    server.route({ method: 'GET', path: '/testauth', handler: defaultHandler, config: { auth: 'auth0' } });

    require('./api/user')(server, '/api', db.models.User);

    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    });
});

