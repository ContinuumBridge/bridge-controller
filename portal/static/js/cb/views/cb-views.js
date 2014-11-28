
Portal.NowrapRegion = Marionette.Region.extend({
  open: function(view){
    //this.$el.html(view.$el.html());
    view.$el.children().clone(true).appendTo(this.$el);
  }
});
