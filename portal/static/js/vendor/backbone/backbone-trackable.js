
// This model (and any other model extending it) will be able to tell if it is synced with the server or not
module.exports = TrackableModelMixin = {

  initialize: function() {
    // If you extend this model, make sure to call this initialize method
    // or add the following line to the extended model as well
    //console.log('initialize called on trackable', this.toJSONString());
    this.set({hasChangedSinceLastSync: false}, {silent: true});
    //this.listenTo(this, 'change', this.modelChanged);
    this.bind('change', this.modelChanged);
  },

  modelChanged: function(event) {
      console.log('Model Changed', event.changedAttributes());

      var changed = event.changedAttributes();

      if (CBApp._isInitialized && changed && !changed.hasOwnProperty('hasChangedSinceLastSync')) {
        this.set({hasChangedSinceLastSync: true});
      }
  },

  sync: function(method, model, options) {
    options = options || {};
    var success = options.success;
    options.success = function(resp) {
      success && success(resp);
      model.hasChangedSinceLastSync = false;
      model.set({hasChangedSinceLastSync: false}, {silent: true});
    };
    //return Backbone.sync(method, model, options);
  }

};

