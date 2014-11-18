###
CRUD update
###
_ = require 'lodash'

module.exports = (options) ->
  (request, reply) ->

    params = request.params
    payload = request.payload

    if options.omit
      payload = _.omit payload, options.omit

    Model = options.model

    #field manipulation and validation
    fields =  options.fields
    if fields
      errors = {}
      for  index, field of fields
        if _.isFunction field
          val = field payload[index], payload, request
          if not _.isUndefined val
            payload[index] = val

        else
          if _.isFunction field.transform
            #get the value of the paramter being manuplated
            result = field.transform payload[index], payload, request
            if result
              payload[index] = result

          #run validation but only if it exists in the payload
          if payload[index] and  _.isFunction field.validate
            err = field.validate payload[index], payload, request
            if err
              herror = request.hapi.Error.badRequest err
              return reply herror

          #rename
          if field.rename and where[index]
            payload[field.rename] = payload[index]
            delete payload[index]

      if not _.isEmpty(errors)
        herror = request.hapi.Error.badRequest()
        error.output.payload =  {fields: erros}
        return reply herror

    #find the event
    Model.findOne(params).exec (err, model)->
      if err
        return reply request.hapi.Error.internal err
      if not model
        return reply request.hapi.Error.notFound(Model.modelName + " with id of" + params.id + " not found")

      canUpdate = if options.check then options.check(model, request, 'update') else true

      if canUpdate
        #update the doc
        model.set payload
        model.save ()->
          if options.after
            newReply = options.after model, request, 'update'
            if newReply
              model = newReply

          eventName = Model.modelName[0].toUpperCase() + Model.modelName.slice 1
          request.server.emit 'update' + eventName, model

          eventName = Model.collection.name[0].toUpperCase() + Model.collection.name.slice 1
          request.server.emit 'update' + eventName, model

          return reply model
      else
        return reply request.hapi.Error.unauthorized 'permission denied'
