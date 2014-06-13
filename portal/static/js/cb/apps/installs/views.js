
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../device_permissions/views');

CBApp.AppInstallView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/appInstall.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .uninstall-button': 'uninstall'
    },

    initialize: function() {

        this.appDevicePermissionListView =
            new CBApp.AppDevicePermissionListView({
                appInstall: this.model
            });
    },

    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "APPID" + app.get('id');
      return data;
    },

    uninstall: function() {

        console.log('uninstall in install view', this.model);
        this.model.uninstall();
    },

    onRender : function(){

        console.log('AppInstallView render', this);
        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge) {

            console.log('AppInstallView promise render', self);

            var deviceInstalls = currentBridge.get('deviceInstalls');
            console.log('AppInstallView promise render 2', deviceInstalls);
            self.appDevicePermissionListView.setCollection(deviceInstalls);
            var $appConfig = self.$('.app-config');
            console.log('AppInstallView promise render 3', $appConfig);
            //var appID = '#APPID' + self.model.get('app').get('id');
            //$appDevicePermissionList = self.$(appID);
            //var content = self.appDevicePermissionListView.render().$el;
            console.log('AppInstallView promise render 4');
            //$appConfig.html(content);
            self.appDevicePermissionListView.setElement($appConfig).render();
            console.log('AppInstallView promise render 5');
            console.log('AppInstallView promise render 6', self.appDevicePermissionListView);
            //$appDevicePermissionList.html(self.appDevicePermissionListView.render().$el);
        });
    }
});

CBApp.AppInstallListView = Marionette.CompositeView.extend({

    template: require('./templates/appInstallSection.html'),
    itemView: CBApp.AppInstallView,
    itemViewContainer: '.app-list',

    emptyView: CBApp.ListItemLoadingView,

    events: {
        'click #install-apps': 'showLicences'
    },

    showLicences: function() {
        console.log('click showLicences');
        CBApp.Config.controller.showAppLicences();
    },

    onRender : function(){

    }
});
