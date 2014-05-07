
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.Regions = {};

CBApp.Regions.Fade = Marionette.Region.extend({

    open: function(view){
        this.$el.hide();
        this.$el.html(view.el);
        this.$el.slideDown("fast");
    }
});