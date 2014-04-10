
// This model (and any other model extending it) will be able to tell if it is synced with the server or not
module.exports = TrackableModelMixin = {

  hasChangedSinceLastSync: false

  /*
  initialize: function() {
    // If you extend this model, make sure to call this initialize method
    // or add the following line to the extended model as well
    this.listenTo(this, 'change', this.modelChanged);
  },

  modelChanged: function() {
    this.hasChangedSinceLastSync = true;
  },

  sync: function(method, model, options) {
    options = options || {};
    var success = options.success;
    options.success = function(resp) {
      success && success(resp);
      model.hasChangedSinceLastSync = false;
    };
    return Backbone.sync(method, model, options);
  }

   */
};

