
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'nested-item new-item',
    template: '#appDevicePermissionItemViewTemplate',

    events: {
        'change input.permission-switch': 'permissionSwitch',
        //'click #interest-button': 'interestButtonClick',
    },

    permissionSwitch: function(e) {

        console.log('e is', e);

        var $permissionSwitch = $(e.currentTarget);
        var val = $permissionSwitch[0].checked;

        this.model.changePermission(val);
        //var val = this.$('#' + this.model.get('appDevicePermissionID') + ':checked').val();

        console.log('permissionSwitch was fired!', val);
    },

    serializeData: function() {

      console.log('Model in AppDevicePermissionView ', this.model)
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
        /*
        CBApp.deviceInstallCollection.where(

        )
         */

        console.log('savedAppDevicePermissionCollection', savedAppDevicePermissionCollection);

        var appDevicePermissionArray = CBApp.getCurrentBridge().get('deviceInstalls').map(function(deviceInstall) {

            console.log('appDevicePermission', deviceInstall.get('appDevicePermission'));

            console.log('AppDevicePermission onRender that.model', that.model)

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
            /*
            var appDevicePermission = CBApp.AppDevicePermission.findOrCreate({
                appInstall: that.model,
                deviceInstall: deviceInstall
            },{parse: true});
            */

            Test = {};
            Test.di = deviceInstall;
            Test.ai = that.model;
            Test.adp = appDevicePermission;
            console.log('appInstall is', that.model)
            console.log('appDevicePermission is', appDevicePermission )

            return appDevicePermission;
        });

        console.log('appDevicePermissionArray is', appDevicePermissionArray );

        var appDevicePermissionCollection = new CBApp.AppDevicePermissionCollection(appDevicePermissionArray);

        var appDevicePermissionListView = new CBApp.AppDevicePermissionListView({ collection: appDevicePermissionCollection });
                                                  //className: this.model.get('app').get('name') });
        var appID = '#APPID' + this.model.get('app').get('id');
        $appDevicePermissionList = this.$(appID);
        console.log('appDevicePermissionList is', $appDevicePermissionList)
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
      console.log("AppListView Rendered");
    }
});

CBApp.AppLayoutView = Marionette.Layout.extend({
    template: '#appSectionTemplate',
    regions: {
        appList: '#app-list',
        appOptions: '#app-options'
    },
    onRender: function() {
        console.log('AppLayoutView rendered', this);
        var appListView = new CBApp.AppListView({ collection: this.collection }); 
        //var optionView = new CBApp.AppOptionsView({});
    
        this.appList.show(appListView);
        //this.appOptions.show(optionView);
    }   
});


