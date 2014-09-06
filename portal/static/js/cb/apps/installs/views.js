
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

        this.staffView = new CBApp.StaffAppInstallView({
            model: this.model,
        });
        this.staffView.licenceOwner = this.model.get('licence').get('user');
        this.appDevicePermissionListView =
            new CBApp.AppDevicePermissionListView({
                appInstall: this.model
            });
    },

    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "AID" + app.get('id');
      return data;
    },

    uninstall: function() {

        console.log('uninstall in install view', this.model);
        this.model.uninstall();
    },

    onRender : function(){

        console.log('AppInstallView render', this);
        var self = this;

        this.staffView.setElement(this.$('.staff-panel')).render();

        CBApp.getCurrentBridge().then(function(currentBridge) {

            console.log('AppInstall', currentBridge);
            var deviceInstalls = currentBridge.get('deviceInstalls');
            self.appDevicePermissionListView.setCollection(deviceInstalls);
            var $appConfig = self.$('.user-panel');
            console.log('$appConfig is', $appConfig);
            self.appDevicePermissionListView.setElement($appConfig).render();
        }).done();
    }
});


CBApp.StaffAppInstallView = Marionette.ItemView.extend({

    tagName: 'table',
    template: require('./templates/staffAppInstall.html'),

    bindings: {
        '.app-install-id': 'id'
        /*
        {
            observe: [],
            onGet: function() {
                return "AppInstall ID: " + this.model.get('id');
            }
        }
        */
    },

    licenceOwnerBindings: {
        '.licence-owner': 'first_name',
        '.licence-owner-id': 'id'
        /*
            {
            observe: [],
            onGet: function() {
                //return this.model.get('licence').get('id');
                return "Licence owner: " + this.licenceOwner.get('first_name')
                    + " (" + this.licenceOwner.get('id') + ")";
            }
        }
        */
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
        if (this.licenceOwner) {
            this.stickit(this.licenceOwner, this.licenceOwnerBindings);
        }
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
