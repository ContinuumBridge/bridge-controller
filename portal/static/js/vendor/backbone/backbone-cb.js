

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
};

module.exports = {

    // Return a copy of the model's `attributes` object.
    toJSONString: function(options) {

      var jsonAttributes = JSON.stringify(_.clone(this.attributes));
      return jsonAttributes;
    },

    destroyOnServer: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

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
        // Reset trackit
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

    /*
    initialize: function() {
      Backbone.Deferred.Model.prototype.initialize.apply(this, arguments);
      _.bindAll(this, "mark_to_revert", "revert");
      return this.mark_to_revert();
    },

    save: function(attrs, options) {
      var self, success, value;
      self = this;
      options || (options = {});
      success = options.success;
      options.success = function(resp) {
        self.trigger("save:success", self);
        if (success) {
          success(self, resp);
        }
        return self.mark_to_revert();
      };
      this.trigger("save", this);
      value = Backbone.Deferred.Model.prototype.save.call(this, attrs, options);
      return value;
    },
    */

    mark_to_revert: function() {
      return this._revertAttributes = _.clone(this.attributes);
    },

    revert: function() {
      if (this._revertAttributes) {
        return this.set(this._revertAttributes, {
          silent: true
        });
      }
    }
};