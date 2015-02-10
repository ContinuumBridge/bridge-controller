
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
        });

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
    },

    renderItem: function (item) {
        console.log('appInstallView createItem item', item);
        var cid = item.cid;

        var appInstallCollection = this.getCollection()
        var appInstall = appInstallCollection.get({cid: cid});

        var app = appInstall.get('app');
        var title = app.get('name');
        var subtitle = "Test subtitle";

        var deviceInstalls = this.props.deviceInstalls;

        return < Portal.AppInstallView key={cid} title={title} subtitle={subtitle}
            deviceInstalls={deviceInstalls} model={appInstall} />
    }
});
