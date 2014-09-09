
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.ClientControlView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/clientControl.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .uninstall-button': 'uninstall'
    },

    initialize: function() {

    },

    /*
    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "AID" + app.get('id');
      return data;
    },
    */

    delete: function() {

        console.log('uninstall in install view', this.model);
        this.model.uninstall();
    },

    onRender : function(){

        var self = this;

        //var $appConfig = self.$('.user-panel');
        //self.appDevicePermissionListView.setElement($appConfig).render();
    }
});

CBApp.ClientControlListView = Marionette.CompositeView.extend({

    template: require('./templates/clientControlSection.html'),
    itemView: CBApp.ClientControlView,
    itemViewContainer: '.client-list',

    emptyView: CBApp.ListItemLoadingView,

    events: {
        'click #create-client': 'createClient'
    },

    createClient: function() {
        CBApp.Config.controller.createClient();
    },

    onRender : function(){

    }
});
