
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'nested-item new-item',
    template: '#appDevicePermissionItemViewTemplate',

    events: {
        'change input.permission-switch': 'permissionSwitch',
    },

    permissionSwitch: function(e) {

        var $permissionSwitch = $(e.currentTarget);
        var val = $permissionSwitch[0].checked;

        this.model.changePermission(val);
    },

    serializeData: function() {

      var deviceFriendlyName = this.model.get('deviceInstall').get('friendly_name');
      //var permission = this.model.get('id') ? 'checked' : '';
      var id = this.model.get('id') || this.model.cid;
      //this.model.set('appDevicePermissionID', "ADPID" + id);
      var tmpl_data = _.extend(this.model.toJSON(), {deviceFriendlyName: deviceFriendlyName,
                                                     permissionChecked: this.model.get('id') ? 'checked' : '',
                                                     appDevicePermissionID: 'ADPID' + id });

      return tmpl_data;
    }
});

CBApp.AppDevicePermissionListView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.AppDevicePermissionView

});

CBApp.AppView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: '#appItemViewTemplate',

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
    template: '#appSectionTemplate',
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


