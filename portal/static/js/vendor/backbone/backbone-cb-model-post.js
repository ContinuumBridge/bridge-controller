
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

        var attrs = attributes || {};
        options || (options = {});

        attrs.isGhost = attrs[ this.idAttribute ] ? false : true;

        OriginalModel.call(this, attrs, options);

        this.startTracking();
    },


    isSyncing: function() {
        return !!this.get('id') == this.get('isGhost');
    },

    save: function(key, val, options) {

        var self = this;
        
        //this.set({isGhost: false}, {trackit_silent:true});
        this.set({isGhost: false});
        //this.trigger('change');

        return OriginalModel.prototype.save.apply(this, arguments).then(
            function(result) {

                console.log('Save successful', result);
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
        if (this.fetched == true) return;

        return OriginalModel.prototype.fetch.apply(this, arguments).then(
            function(result) {

                console.log('Fetch result', result);
                result.model.set({'isGhost': false}, {trackit_silent:true});
                self.fetched = true;

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

    destroy: function(options) {

        var self = this;

        self.set('isGhost', true);

        return OriginalModel.prototype.destroy.call(this, options).then(
            function(result) {
                //Backbone.Relational.store.unregister(self);
                return result;
            },
            function(error) {
                self.set('isGhost', false);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
            }
        );
    },

    /*
    relationalDestroy: function(options) {

        options = options ? _.clone(options) : {};

        var success = options.success;
        var relations = this.getRelations();
        var self = this;
        options.success = function(resp) {

            Backbone.Relational.store.unregister(self);
            /*
            _.forEach(relations, function(relation) {
                // Delete relations on other models to this model
                self.updateRelationToSelf(relation, {destroy: true});
            });
            if (success) success(model, resp, options);
        }
        OriginalModel.prototype.destroy.call(this, options);
    },
    */

    destroyOnServer: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      // ADDED Set isGhost to true, indicating the model is being deleted on server
      this.set({isGhost: true}, {trackit_silent:true});
      //this.set('isGhost', true);

      //var destroy = function() {
      //  model.trigger('destroy', model, model.collection, options);
      //};
      var destroyOnServer = function() {
          model.trigger('change', model, model.collection, options);
      }
      options.success = function(resp) {
        //if (options.wait || model.isNew()) destroy();
        destroyOnServer();
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
      destroyOnServer();
      return xhr;
    },

    delete: function(options) {
        options = options ? _.clone(options) : {};
        this.stopListening();
        this.trigger('destroy', this, this.collection, options);
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