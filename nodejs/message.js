
var _ = require('underscore')
    ,logger = require('./logger').logger
    ;

// Create local references to array methods we'll want to use later.
var array = [];
var slice = array.slice;

Message = function(attributes, options) {

    var unknownAttrs = attributes || {};
    var attrs = (typeof(unknownAttrs) == 'string') ? JSON.parse(unknownAttrs) : unknownAttrs;
    options || (options = {});
    this.attributes = {};
    //if (options.parse) attrs = this.parse(attrs, options) || {};
    //attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
};

_.extend(Message.prototype, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Return a copy of the model's `attributes` object as a string.
    toJSONString: function(options) {

      var jsonAttributes = JSON.stringify(_.clone(this.attributes));
      return jsonAttributes;
    },

    setJSON: function(jsonAttributes, options) {

        if (typeof jsonAttributes == 'string') {
            try {
                var attributes = JSON.parse(jsonAttributes);
            } catch (error) {
                logger.error(error);
            }
        } else if (typeof jsonAttributes == 'object') {
            var attributes = jsonAttributes;
        }

        if (!options) options = {};

        this.set(attributes, options);
    },

    return: function(source) {

        //this.set('body', data);
        // Switches the original source to the destination
        var src = source || "";
        var newDestination = this.get('source') || "";
        var newSource = src || this.get('destination');
        this.set('destination', newDestination);
        this.set('source', newSource);
    },

    findDestination: function(dest) {

        var proposedDestination = this.get('destination');
        if (typeof proposedDestination == 'string') {
            proposedDestination = [ proposedDestination ];
        }
        var destRegex = new RegExp('^' + dest + '(.+)?');
        return _.find(proposedDestination, function(proposedDest) {
            return proposedDest.match(destRegex);
        });
    },

    filterDestination: function(destination) {
        // Filters a messages destination based on destination provided
        if (typeof destination == 'string') {
            destination = [ destination ];
        }
        return _.filter(destination, this.findDestination, this);
    },

    conformDestination: function(destination) {
        // Unfinished

        if (typeof destination == 'string') {
            logger.log('debug', 'destination is a string')
            if(!this.checkDestination(destination)) {
                this.set('destination', destination);
            }
        } else if (destination instanceof Array) {

        }
    },

    checkSource: function(source) {
        // Checks if a message's source conforms to the source given
        var sourceRegex = new RegExp('^' + source + '(.+)?');
        var proposedSource = this.get('source');
        return !!proposedSource.match(sourceRegex);
    },

    conformSource: function(source) {
        // Ensure that the message source conforms to the given source
        if (!this.checkSource(source)) {
            logger.log('authorization', 'Client ', source, ' is not allowed to send from source', this.get('source'));
            this.set('source', source);
        }
    },

    remove: function(source) {
        // Checks that a message's source matches the source given
        var sourceRegex = new RegExp('^' + source + '(.+)?');
        var proposedSource = message.get('source');
        if (!proposedSource.match(sourceRegex)) {
            logger.log('authorization', 'Client ', source, ' is not allowed to send from source', proposedSource);
            this.set('source', self.connection.config.subscriptionAddress );
        }
    },

    /*
    returnError: function(error) {

        this.set('body', error);
        this.returnToSource()
    },
    */

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      this._pending = false;
      this._changing = false;
      return this;
    },

    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

})

/*
// Underscore methods that we want to implement on the Model.
var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

// Mix in each Underscore method as a proxy to `Model#attributes`.
_.each(modelMethods, function(method) {
  if (!_[method]) return;
    Message.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
});

*/

/*
m = new Message({
    test2: 'Test value 2!'
});

n = new Message('{"test3": "testJSON"}');

m.set('test', 'test value 1');
m.set('test2', 'test value 2');
m.set('test3', 'test value 3');

console.log('test is ', m.get('test'));
console.log('test2 is ', m.get('test2'));
console.log('test3 is ', m.get('test3'));

//m.pick()

console.log('test3 is ', n.get('test3'));
*/

/*
repl.start({
    prompt: "node via stdin> ",
    input: process.stdin,
    output: process.stdout
});
*/

module.exports = Message;
