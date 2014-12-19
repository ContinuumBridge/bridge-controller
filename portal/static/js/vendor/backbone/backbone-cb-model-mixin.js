

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
};

module.exports = {

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
    */
};



