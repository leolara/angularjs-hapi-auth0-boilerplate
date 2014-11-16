var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    email: { type: String, required: true},
    auth0_id: String
});

module.exports = mongoose.model('User', userSchema);
