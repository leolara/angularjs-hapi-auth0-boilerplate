var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    userId: String,
    content: String
});

module.exports = mongoose.model('Message', messageSchema);
