###
CRUD findOne
###
_ = require 'lodash'

module.exports = (options) ->

  (request, reply) ->
    params = _.merge request.query, request.params

    #get the model
    Model = options.model

    callback = (err, model)->
      if err
        return reply request.hapi.Error.internal err
      if not model
        return reply request.hapi.Error.notFound("model searched for by " + JSON.stringify(params) + " not found")
      return reply model

    if request.pre.model or _.isNull(request.pre.model)
      callback(null, request.pre.model)
    else
      #find the model
      Model.findOne(params).exec callback
