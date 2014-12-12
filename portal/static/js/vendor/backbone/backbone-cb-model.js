
var OriginalModel = Backbone.Deferred.Model;

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    };
};

var CBModel = OriginalModel.extend({

    constructor: function(attributes, options) {

        attributes.isGhost = attributes[ this.idAttribute ] ? false : true;

        OriginalModel.call(this, attributes, options);

        this.startTracking();
    },

    save: function(key, val, options) {

        var self = this;
        
        //this.set({isGhost: true}, {trackit_silent:true});

        return OriginalModel.prototype.save.call(this, arguments).then(
            function(result) {

                console.log('Save result', result);
                //var model = resolveModel.model;
                result.model.set({'isGhost': false}, {trackit_silent:true});

                return result;
                //model.trigger('change');
            },
            function(error) {
                console.error('Save error', error);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
                self.resetAttributes();
            }
        )
    },

    fetch: function(key, val, options) {

        var self = this;

        return OriginalModel.prototype.fetch.call(this, arguments).then(
            function(result) {

                console.log('Fetch result', result);
                //var model = resolveModel.model;
                result.model.set({'isGhost': false}, {trackit_silent:true});

                return result;
                //model.trigger('change');
            },
            function(error) {

                console.error('Fetch error', error);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
                self.resetAttributes();
            }
        )
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
        model.restartTracking();
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      options.error = function(resp) {
          model.resetAttributes();
      }

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      //if (!options.wait) destroy();
      return xhr;
    },

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

Backbone.Deferred.Model = CBModel;