_ = require 'lodash'
###
Generic Controllers, generilezed logic for controllers.
@contructor
###
class Generic
  ###
  global options to be passed to the all of the CRUD functions
  @property options
  @type String
  ###
  options:{}

  ###
  Constructor for the generic class
  @method constructor
  @param {Object} options A options variable
  @param {Object} options.fields A dictnary of fields and operations (to,validate, transform) that will be applied to them
  @param {Object} options.model The mongoose model to that the generic will use
  ###
  constructor: (@options) ->

  ###
  Creates objects from POST payloads
  @method create
  @param {Object} options A options variable
  @param {Function} options.after A callback that can be used to manuplate the results
  @param {Object} options.fields A dictnary of fields and operations (to,validate, transform) that will be applied to them
  @param {Object} options.model The mongoose model to that the generic will use
  @param {Array} options.omit An array of fields to omit from the update
  ###
  create: (options) ->
    #combinded options
    combined = {}
    _.merge combined, @options, options
    return require("./create")(combined)

  ###
  Finds objects based on the query
  @method create
  @param {Object} options A options variable
  @param {Function} options.after A callback that can be used to manuplate the results
  @param {Object} options.fields A dictnary of fields and operations (to,validate, transform) that will be applied to them
  @param {Object} options.model The mongoose model to that the generic will use
  @param {Object} options.queries scans the query string of these method and if they exists exicutes thems
  @param {Sting}  defaultOrder
  @param {Intiger} maxLimit the max number of items to find
  ###
  find: (options) ->
    #combinded options
    combined = {}
    _.merge combined, @options, options
    return require("./find")(combined)

  ###
  Finds objects based on the query
  @method create
  @param {Object} options A options variable
  @param {Function} otions.before A function that runs before anything else
  @param {Function} options.after A callback that can be used to manuplate the results
  @param {Object} options.model The mongoose model to that the generic will use
  ###
  findOne: (options) ->
    #combinded options
    combined = {}
    _.merge combined, @options, options
    return require("./findOne")(combined)

  ###
  Finds one object based on the query
  @method create
  @param {Object} options A options variable
  @param {Function} options.after A callback that can be used to manuplate the results
  @param {Object} options.fields A dictnary of fields and operations (to,validate, transform) that will be applied to them
  @param {Object} options.model The mongoose model to that the generic will use
  @param {Array} options.omit An array of fields to omit from the update
  ###
  update: (options) ->
    #combinded options
    combined = {}
    _.merge combined, @options, options
    return require("./update")(combined)

  ###
  Deletes ojects base on the query
  @method create
  @param {Object} options A options variable
  @param {Function} options.after A callback that can be used to manuplate the results
  @param {Function} a truthy fucntion on whether to delete or not
  @param {Object} options.fields A dictnary of fields and operations (to,validate, transform) that will be applied to them
  @param {Object} options.model The mongoose model to that the generic will use
  ###
  delete: (options) ->
    #combinded options
    combined = {}
    _.merge combined, @options, options
    return require("./destroy")(combined)

module.exports = Generic
