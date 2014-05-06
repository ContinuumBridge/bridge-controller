
// This model (and any other model extending it) will be able to tell if it is synced with the server or not
Backbone.Model = Backbone.Model.extend({

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
      console.log('Model Changed changed:', changed.hasOwnProperty('hasChangedSinceLastSync'));

      if (CBApp._isInitialized && changed && !changed.hasOwnProperty('hasChangedSinceLastSync')) {
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
});

