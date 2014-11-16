
module.exports = function (server) {
    server.route({
        method: 'GET',
        path: '/build/{param*}',
        handler: {
            directory: {
                path: 'client/build',
                index: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'client/bin',
                index: true
            }
        }
    });
};
