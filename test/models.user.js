
var test = require('tape');

var nconf = require('nconf');

nconf.argv().env('_');

nconf.file({file: 'config/server.json'});

require('../server/boot/db.js')(nconf, true, function (__err, db) {

    test('Create and find simple user', function (t) {
        t.plan(4);
        // Clear DB
        db.models.User.remove(function (err) {
            t.equal(err, null, 'No error removing collection');
        });
        var user = new db.models.User();
        user.email = 'johndoe@example.com';
        user.save(function (err) {
            t.equal(err, null, 'No error saving');
            db.models.User.findOne({email: 'johndoe@example.com'}, function (err, user) {
                t.equal(err, null, 'No error querying');
                t.equal(user.email, 'johndoe@example.com', 'Email matches');
            });
        });
    });

    test('User entity should have email', function (t) {
        t.plan(2);

        var user = new db.models.User();
        user.save(function (err) {
            t.ok(err, 'Inserting User without e-mail gives an error');
            t.equal(err.name, 'ValidationError', 'Error is a validation error');
        });
    });

    test('disconnect', function (t) {
        t.plan(1);
        db.disconnect();
        t.pass('Disconnected');
    });
});
