/**
 * Very simple implementation of Hapi hanlders that do REST operations on
 * Mongoose entitites.
 *
 * At some point, I should make a npm module of this.
 */

var Boom = require('boom');

function create(Model) {
    return function (request, reply) {
        var model = new Model(request.payload);
        return model.save(function(err) {
            if (err) {
                return reply(Boom.expectationFailed('Error persisting entity', err));
            }
            return reply(model);
        });
    };
}

function read(Model) {
    return function (request, reply) {
        var params = _.merge(request.query, request.params);
        return Model.findOne(params).exec(function (err, model) {
            if (err) {
                return reply(Boom.expectationFailed('Error reading entity', err));
            }
            if (!model) {
                return reply(Boom.notFound('Error reading entity', err));
            }
            return reply(model);
        });
    };
}

function update(Model) {
    var reader = read(Model);
    return function (request, reply) {
        return reader(request, function (model) {
            if (model.isBoom) { // handles error reading
                return reply(model);
            }

            model.set(request.payload);
            return model.save(function(err) {
                if (err) {
                    return reply(Boom.expectationFailed('Error persisting entity changes', err));
                }
                return reply(model);
            });
        });
    };
}

function destroy(Model) {
    var reader = read(Model);
    return function (request, reply) {
        return reader(request, function (model) {
            if (model.isBoom) { // handles error reading
                return reply(model);
            }

            return model.remove(function(err) {
                if (err) {
                    return reply(Boom.expectationFailed('Error destroying entity', err));
                }

                return reply(model);
            });
        });
    };
}

function list(Model) {
    return function (request, reply) {
        return Model.find({}, function (err, models) {
            if (err) {
                return reply(Boom.expectationFailed('Error reading entities', err));
            }

            return reply(models);
        });
    };
}

module.exports = function (options) {
    return {
        create: create(options.model),
        read: read(options.model),
        update: update(options.model),
        destroy: destroy(options.model),
        delete: destroy(options.model),
        list: list(options.model)
    };
};
