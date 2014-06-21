
var OriginalModel = Backbone.RelationalModel;

var CBModel = OriginalModel.extend({

    constructor: function(attributes, options) {

        var args = Array.prototype.slice.call(arguments);
        var attrs = args[0] || {};
        // Set a model to be a ghost if it has not been instantiated on the server
        attrs.isGhost = attrs[ this.idAttribute ] ? false : true;
        //Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
        args[0] = attrs;
        OriginalModel.apply(this, args);
    },

    save: function(key, val, options) {

        console.log('save cb');
        // Copied from Backbone source
        var attrs, method, xhr, attributes = this.attributes;
        if (key == null || typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = _.extend({validate: true}, options);

        var success = options.success;
        options.success = function(model, resp, options) {
          // ADDED If this model saved successfully it is not a ghost
          model.set('isGhost', false);
          if (success) success(model, resp, options);
        };

        var args = Array.prototype.slice.call(arguments);
        // ADDED Set isGhost to false, indicating the model is being instantiated on server
        this.set('isGhost', false);
        OriginalModel.prototype.save.apply(this, args);
    }

});

Backbone.RelationalModel = CBModel;