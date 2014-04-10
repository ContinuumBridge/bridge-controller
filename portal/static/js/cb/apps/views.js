
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('./device_permissions/views');

CBApp.AppView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: require('./templates/app.html'),

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

        var that = this;
        var savedAppDevicePermissionCollection = this.model.get('devicePermissions');

        var appDevicePermissionArray = CBApp.getCurrentBridge().get('deviceInstalls').map(function(deviceInstall) {

            var appDevicePermission = CBApp.appDevicePermissionCollection.findWhere({
                appInstall: that.model,
                deviceInstall: deviceInstall
            });

            if (!appDevicePermission) {
                var appDevicePermission = new CBApp.AppDevicePermission({
                    appInstall: that.model,
                    deviceInstall: deviceInstall
                });
                CBApp.appDevicePermissionCollection.add(appDevicePermission);
            }

            return appDevicePermission;
        });

        var appDevicePermissionCollection = new CBApp.AppDevicePermissionCollection(appDevicePermissionArray);

        var appDevicePermissionListView = new CBApp.AppDevicePermissionListView({ collection: appDevicePermissionCollection });
                                                  //className: this.model.get('app').get('name') });
        var appID = '#APPID' + this.model.get('app').get('id');
        $appDevicePermissionList = this.$(appID);
        $appDevicePermissionList.html(appDevicePermissionListView.render().$el);

        //this.$('#test').html('More test!');
        //this.appDevicePermissionList.show(appDevicePermissionListView);
    }
});

CBApp.AppListView = Marionette.CollectionView.extend({
    
    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.AppView,

    onRender : function(){

    }
});

CBApp.AppLayoutView = Marionette.Layout.extend({

    template: require('./templates/appSection.html'),

    regions: {
        appList: '#app-list',
        appOptions: '#app-options'
    },
    onRender: function() {
        var appListView = new CBApp.AppListView({ collection: this.collection });
        //var optionView = new CBApp.AppOptionsView({});
    
        this.appList.show(appListView);
        //this.appOptions.show(optionView);
    }   
});


