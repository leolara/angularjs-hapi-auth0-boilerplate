###
this is a generic create controller
###
_        = require 'lodash'

module.exports = (options) ->

  (request, reply) ->

    payload = request.payload

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
            payload[index] = field.transform payload[index], payload, request

          #run validation
          if _.isFunction field.validate
            err = field.validate payload[index], payload, request
            if err
              errors[index] = err

          #rename
          if field.rename and where[index]
            payload[field.rename] = payload[index]
            delete payload[index]

      if not _.isEmpty(errors)
        herror = request.hapi.Error.badRequest()
        herror.output.payload =  {fields: errors}
        return reply herror

    #create a new model
    model = new Model payload
    #and save it
    model.save (err)->
      if err
        if err.name? and err.name is 'ValidationError'
          fields = {}
          for key, error of err.errors
            fields[key] = key + ' is ' + error.type
          #moongoose error, probably validation
          herror = request.hapi.Error.badRequest()
          herror.output.payload =  {fields: fields}
          return reply herror
        else
          #mongo db itself is erroring
          herror = request.hapi.Error.internal err
          return reply herror
      else
        #run after function only if there is no errors
        if options.after
          newVals = options.after model, request, 'create'
          if newVals
            model = newVals

        eventName = Model.modelName[0].toUpperCase() + Model.modelName.slice 1
        request.server.emit 'create' + eventName, model

        eventName = Model.collection.name[0].toUpperCase() + Model.collection.name.slice 1
        request.server.emit 'create' + eventName, model

        return reply model
