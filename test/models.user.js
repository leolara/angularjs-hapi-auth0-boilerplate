
var test = require('tape');

var nconf = require('nconf');

nconf.argv().env('_');

nconf.file({file: 'config/server.json'});

var db = require('../server/boot/db.js')(nconf, true);

test('Create and find simple user', function (t) {
    t.plan(3);
    // Clear DB
    db.models.User.remove();
    var user = new db.models.User();
    user.email = 'johndoe@example.com';
    user.save(function (err) {
        t.equal(null, err, 'Not error saving');
        db.models.User.findOne({ email: 'johndoe@example.com' }, function (err, user) {
            t.equal(null, err, 'Not error querying');
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

// We need this so the test exists, otherwise it stays running
test('disconnect', function (t) {
    t.plan(1);
    db.disconnect();
    t.pass('Disconnected');
});
