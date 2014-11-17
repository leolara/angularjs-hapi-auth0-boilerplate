
module.exports = function (server) {
    var options = {
        opsInterval: 1000,
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', request: '*' }]
        }]
    };

    server.pack.register({
        plugin: require('good'),
        options: options
    }, function (err) {
        if (err) {
            server.log(['error'], err);
            return;
        }
    });
};
