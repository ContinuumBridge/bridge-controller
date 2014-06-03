
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../device_permissions/views');

CBApp.AppInstallView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/appInstall.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click #interest-button': 'interestButtonClick',
    },

    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "APPID" + app.get('id');
      return data;
    },

    onRender : function(){

        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge) {

            self.appDevicePermissionListView =
                new CBApp.AppDevicePermissionListView({
                    collection: currentBridge.get('deviceInstalls'),
                    appInstall: self.model
                });
            //self.appDevicePermissionListView._initialEvents();

            var appID = '#APPID' + self.model.get('app').get('id');
            $appDevicePermissionList = self.$(appID);
            $appDevicePermissionList.html(self.appDevicePermissionListView.render().$el);
        });
    }
});

CBApp.AppInstallListView = Marionette.CompositeView.extend({

    template: require('./templates/appInstallSection.html'),
    itemView: CBApp.AppInstallView,
    itemViewContainer: '#app-list',

    emptyView: CBApp.ListItemLoadingView,

    onRender : function(){

    }
});
