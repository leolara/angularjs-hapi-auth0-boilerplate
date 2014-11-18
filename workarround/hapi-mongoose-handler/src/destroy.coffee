###
CRUD delete
###
_ = require('lodash')

module.exports = (options) ->
 
  (request, reply) ->
    params = request.params

    Model = options.model

    Model.findOne(params).exec (err, model)->
      if err
        return reply request.hapi.Error.internal err
      if not model
        return reply request.hapi.Error.notFound("model deleted by " + JSON.stringify(params) + " not found")

      canDelete = if options.check then options.check(model, request, 'delete') else true

      if canDelete
        #remove the doc
        model.remove ()->
          if options.after
            newReply = options.after model, request, 'delete'
            if newReply
              model = newReply

          eventName = Model.modelName[0].toUpperCase() + Model.modelName.slice 1
          request.server.emit 'delete' + eventName, model

          eventName = Model.collection.name[0].toUpperCase() + Model.collection.name.slice 1
          request.server.emit 'delete' + eventName, model

          return reply model
      else
        return reply request.hapi.Error.unauthorized 'permission denied'
