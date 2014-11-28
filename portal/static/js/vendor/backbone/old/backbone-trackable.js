
(function() {
    var origSet = Backbone.Model.prototype.set;
    // This model (and any other model extending it) will be able to tell if it is synced with the server or not
    Backbone.Model = Backbone.Model.extend({

      initialize: function() {
        // If you extend this model, make sure to call this initialize method
        // or add the following line to the extended model as well
        //console.log('initialize called on trackable', this.toJSONString());
        this.set({hasChangedSinceLastSync: false});
        //this.listenTo(this, 'change', this.modelChanged);
        this.bind('change', this.modelChanged);
      },

      modelChanged: function(model) {
          console.log('Model Changed', model.changedAttributes());
          console.log('Model Changed event', model);

          var changed = model.changedAttributes();
          console.log('Model Changed changed:', changed.hasOwnProperty('hasChangedSinceLastSync'));

          /*
          var hasChangedSinceLastSync = (this.idAttribute in attrs) ?
              false : true;
          trackedAttr = _.defaults(attrs, {
              hasChangedSinceLastSync: hasChangedSinceLastSync
          });
          */

          if (Portal._isInitialized && changed && !changed.hasOwnProperty('hasChangedSinceLastSync')) {
            this.set({hasChangedSinceLastSync: true});
            test = this;
            console.log('Model hasChangedSinceLastSync', this.get('hasChangedSinceLastSync'));
          }
      },

      sync: function(method, model, options) {
        console.log('SYNC called in trackable');
        options = options || {};
        var success = options.success;
        options.success = function(resp) {
          success && success(resp);
          model.set({hasChangedSinceLastSync: false});
        };
        return Backbone.sync(method, model, options);
      }

      /*
      set: function(key, val, options) {

        var attr, attrs, unset, changes, silent, changing, prev, current;
        if (key == null) return this;

        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }

        /*
        // ADDED If hasChangedSinceLastSync is not present, set it to true
        // unless the attrs are from the server
        var hasChangedSinceLastSync = (this.idAttribute in attrs) ?
            false : true;
        trackedAttr = _.defaults(attrs, {
            hasChangedSinceLastSync: hasChangedSinceLastSync
        });
        console.log('Tracked attributes are', trackedAttr);

        //Backbone.Model.__super__.set.apply(this, key, val, options);
        return origSet.apply(this, key, val, options);
        Backbone.Model.prototype.set.apply(this, arguments);
        origSet.apply(this, key, val, options);
        return this;
      }
      */
    });


})();
