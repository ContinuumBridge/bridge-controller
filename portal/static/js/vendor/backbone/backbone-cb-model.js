
var OriginalModel = Backbone.RelationalModel;

var CBModel = OriginalModel.extend({

    constructor: function(attributes, options) {

        OriginalModel.call(this, attributes, options);

        attributes.isGhost = attributes[ this.idAttribute ] ? false : true;
        this.startTracking();
    },

    save: function(key, val, options) {

        var self = this;
        
        this.set({isGhost: true}, {trackit_silent:true});

        return OriginalModel.save.call(this, arguments).then(
            function(result) {

                //var model = resolveModel.model;
                result.model.set({'isGhost': false}, {trackit_silent:true});

                return result;
                //model.trigger('change');
            },
            function(error) {

                self.resetAttributes();
            }
        )
    },

    /*
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
          model.restartTracking();
          model.trigger('change');
          if (success) success(model, resp, options);
        };

        var args = Array.prototype.slice.call(arguments);
        // ADDED Set isGhost to false, indicating the model is being instantiated on server
        this.set('isGhost', false);
        OriginalModel.prototype.save.apply(this, args);
    },

    destroyOnServer: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      // ADDED Set isGhost to true, indicating the model is being deleted on server
      this.set('isGhost', true);

      //var destroy = function() {
      //  model.trigger('destroy', model, model.collection, options);
      //};

      options.success = function(resp) {
        //if (options.wait || model.isNew()) destroy();
        // Remove the id from the local model
        if (!model.isNew()) {
            delete model.id;
            model.unset('id');
        }
        if (success) success(model, resp, options);
        // ADDED Reset trackit
        if (model.unsavedAttributes()) model.restartTracking();
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      //if (!options.wait) destroy();
      return xhr;
    },
    */

    toJSONString: function(options) {

        // Return a string copy of the model's `attributes` object.
        var jsonAttributes = JSON.stringify(_.clone(this.attributes));
        return jsonAttributes;
    },

    toJSON: function(options) {

        var json = OriginalModel.prototype.toJSON.apply(this, arguments);
        json.cid = this.cid;
        return json;
    }
});

Backbone.RelationalModel = CBModel;