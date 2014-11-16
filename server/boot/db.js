
var mongoose = require('mongoose');

module.exports = function (config, test) {

    if (test) {
        mongoose.connect(config.get('mongodb:testUri'));
    } else {
        mongoose.connect(config.get('mongodb:uri'));
    }

    return {
        models: {
            User: require('../model/user')
        },
        disconnect: function () {
            mongoose.connection.close();
        }
    };
};
