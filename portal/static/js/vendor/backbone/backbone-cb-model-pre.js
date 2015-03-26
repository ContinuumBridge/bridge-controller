
var OriginalModel = Backbone.Model;

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    };
};

var CBModel = OriginalModel.extend({

    save: function(key, val, options) {

        var attrs, method, xhr, attributes = this.attributes;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (key == null || typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = _.extend({validate: true}, options);

        // If we're not waiting and attributes exist, save acts as
        // `set(attr).save(null, opts)` with validation. Otherwise, check if
        // the model will be valid when the attributes, if any, are set.
        if (attrs && !options.wait) {
            if (!this.set(attrs, options)) return false;
        } else {
            if (!this._validate(attrs, options)) return false;
        }

        // Set temporary attributes if `{wait: true}`.
        if (attrs && options.wait) {
            this.attributes = _.extend({}, attributes, attrs);
        }

        // After a successful server-side save, the client is (optionally)
        // updated with the server-side state.
        if (options.parse === void 0) options.parse = true;
        var model = this;
        var success = options.success;
        options.success = function(resp) {

            if (success) success(model, resp, options);

            // ADDED Dispatch an update, in case the model has already been created by an intervening update
            var itemType = this.__proto__.constructor.modelType;
            Portal.dispatch({
                source: 'portal',
                actionType: 'update',
                itemType: itemType,
                payload: resp
            });
            /*
            // Ensure attributes are restored during synchronous saves.
            model.attributes = attributes;
            var serverAttrs = model.parse(resp, options);
            if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
            if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                return false;
            }
            if (success) success(model, resp, options);
            model.trigger('sync', model, resp, options);
            */
        };
        wrapError(this, options);

        method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
        if (method === 'patch' && !options.attrs) options.attrs = attrs;
        xhr = this.sync(method, this, options);

        // Restore attributes.
        if (attrs && options.wait) this.attributes = attributes;

        return xhr;
    },

    destroyOnServer: function(options) {
      //options.wait || (options = {wait: true});
      options = options ? _.defaults(options, {wait:true}) : {wait: true};
      //options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      // ADDED Set isGhost to true, indicating the model is being deleted on server
      //this.set({isGhost: true}, {trackit_silent:true});
      this.set('isGhost', true);

      var destroyOnServer = function() {
          model.trigger('change', model, model.collection, options);
          // Remove the id from the local model
          if (!model.isNew()) {
              delete model.id;
              model.unset('id');
          }
      };

      options.success = function(resp) {
        console.log('destroyOnServer succeeded', resp);
        //if (options.wait || model.isNew()) destroy();
        destroyOnServer();
        if (success) success(model, resp, options);
        // ADDED Reset trackit
        model.restartTracking();
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      options.error = function(error) {
          console.log('destroyOnServer error', error);
          console.log('destroyOnServer unsavedAttributes', model.unsavedAttributes());
          model.resetAttributes();
          model.set({isGhost: true}, {trackit_silent:true});
          Portal.dispatch({
              source: 'portal',
              actionType: 'create',
              itemType: 'error',
              payload: error
          });
      }

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      //if (!options.wait) destroy();
      destroyOnServer();
      return xhr;
    }
});

Backbone.Model = CBModel;