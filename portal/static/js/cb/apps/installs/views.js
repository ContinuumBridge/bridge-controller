
require('../device_permissions/views');

Portal.AppInstallView = React.createClass({

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'delete',
                onClick: this.uninstall
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    uninstall: function() {

        this.toggleExistenceOnServer(this.props.model);
    },

    renderBody: function() {

        var self = this;

        //var devicePermissions = this.props.devicePermissions;
        var deviceInstalls = this.props.deviceInstalls;
        var appInstall = this.props.model;

        var devicePermissions = appInstall.get('devicePermissions');

        deviceInstalls.each(function(deviceInstall) {

            var adp;
            var adpData = {
                deviceInstall: deviceInstall,
                appInstall: appInstall
            }
            adp = devicePermissions.findWhere(adpData)
            if (!adp) {
                adp = new Portal.AppDevicePermission(adpData);
                appInstall.set('devicePermissions', adp, {remove: false});
            }
            /*
            if(!devicePermissions.findWhere(adpData)) {
                //var permission = new Portal.AppDevicePermission(adpData);
                //console.log('permission is', permission );
                //devicePermissions.add(permission);
            }
            */
        });

        /*
        var devicePermissions = appInstall.get('devicePermissions');

        devicePermissions.on('change relational:change relational:add relational:remove', function(model, event) {
            console.log('event on deviceInstalls', event);
            self.getCollection().trigger('change');
        });
        */

        return (
            < Portal.AppDevicePermissionListView collection={devicePermissions} />
        );
    }
});

Portal.AppInstallListView = React.createClass({

    itemView: Portal.AppInstallView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Apps',
            buttons: [{
                name: 'Install Apps',
                onClick: this.installApps,
                type: 'bold'
            }]
        };
    },

    installApps: function() {
        Portal.router.setParams({action: 'install-app'});
        //Portal.Config.controller.installApps();
    },

    createItem: function (item) {
        console.log('appInstallView createItem item', item);
        var cid = item.cid;

        var appInstallCollection = this.getCollection()
        var appInstall = appInstallCollection.get({cid: cid});
        //var appInstalls = this.getCollection();
        //var appInstall = appInstalls.get({cid: cid});

        var app = appInstall.get('app');
        var title = app.get('name');

        var deviceInstalls = this.props.deviceInstalls;

        return < Portal.AppInstallView key={cid} title={title}
                    deviceInstalls={deviceInstalls} model={appInstall} />
    }
});

/*
Portal.AppInstallView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/appInstall.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .uninstall-button': 'uninstall'
    },

    initialize: function() {

        this.staffView = new Portal.StaffAppInstallView({
            model: this.model
        });
        this.staffView.licenceOwner = this.model.get('licence').get('user');
        this.appDevicePermissionListView =
            new Portal.AppDevicePermissionListView({
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

        Portal.getCurrentBridge().fetch(function(currentBridge) {

            console.log('AppInstall', currentBridge);
            var deviceInstalls = currentBridge.get('deviceInstalls');
            self.appDevicePermissionListView.setCollection(deviceInstalls);
            var $appConfig = self.$('.user-panel');
            console.log('$appConfig is', $appConfig);
            self.appDevicePermissionListView.setElement($appConfig).render();
        }).done();
    }
});

Portal.StaffAppInstallView = Marionette.ItemView.extend({

    tagName: 'table',
    template: require('./templates/staffAppInstall.html'),

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
        if (this.licenceOwner) {
            this.stickit(this.licenceOwner, this.licenceOwnerBindings);
        }
    }
});

Portal.AppInstallListView = Marionette.CompositeView.extend({

    template: require('./templates/appInstallSection.html'),
    itemView: Portal.AppInstallView,
    itemViewContainer: '.app-list',

    emptyView: Portal.ListItemLoadingView,

    events: {
        'click #install-apps': 'showLicences'
    },

    showLicences: function() {
        console.log('click showLicences');
        Portal.Config.controller.showAppLicences();
    },

    onRender : function(){

    }
});

*/