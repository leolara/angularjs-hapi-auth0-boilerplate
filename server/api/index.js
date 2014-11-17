
module.exports = function (server, db, acl) {
    require('./user')(server, '/api', db.models.User, acl);
    require('./message')(server, '/api', db.models.Message, acl);
};
