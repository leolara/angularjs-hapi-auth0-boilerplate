###
CRUD find
###
_ = require 'lodash'

module.exports = (options) ->

  (request, reply) ->
    query = _.merge request.query, request.params
    Model = options.model

    limit = Number query.limit
    sort = query.sort or query.order or undefined
    skip = Number(query.skip or query.offset) or undefined


    #Build the query
    #Remove undefined query
    #(as well as limit, skip, and sort)
    where = _.transform query, (result, param, key)->
      if key not in ['limit', 'offset', 'skip', 'sort', 'client']
        if _.isObject param
          param = _.transform param, (result, prop, key)->
            result["$"+key] = prop
        result[key] = param

    #add queries
    queries =  options.queries
    if queries
      errors = {}
      for  index, field of queries
        if _.isFunction field
          val = field where[index], where, request
          if not _.isUndefined val
            where[index] = val

        else
          if _.isFunction field.transform
            #get the value of the paramter being manuplated
            where[index] = field.transform where[index], where, request

          #run validation
          if _.isFunction field.validate
            err = field.validate where[index], where, request
            if err
              errors[index] = err

          #rename
          if field.rename and where[index]
            where[field.rename] = where[index]
            delete where[index]

      if not _.isEmpty(errors)
        herror = request.hapi.Error.badRequest()
        herror.output.payload =  {fields: errors}
        return reply herror

    #add config
    config = {}
    if options.config
      config = options.config(request.server.settings.app.api)

    #add limit
    if config.maxLimit
      if _.isNaN(limit) or limit > config.maxLimit
        limit = config.maxLimit

    #add order
    if config.defaultOrder and not sort
      sort = config.defaultOrder

    Model.find(where).sort(sort).skip(skip).limit(limit).exec (err, models) ->
      # An error occurred
      if err
        return reply request.hapi.Error.internal err

      #Build set of model values
      modelValues = []
      models.forEach (model) ->
        modelValues.push model

      #add wrapper
      if options.after
        newVals = options.after modelValues, where, request, 'find'
        if newVals
          modelValues = newVals

      return reply modelValues
