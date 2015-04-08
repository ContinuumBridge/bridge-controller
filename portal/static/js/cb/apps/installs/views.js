
require('../device_permissions/views');

Portal.AppInstallView = React.createClass({

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'delete',
                onClick: this.handleUninstall
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    handleUninstall: function() {

        var appInstall = this.props.model;

        appInstall.set({'status': 'should_uninstall'})
        appInstall.save();
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
                appInstall.set('devicePermissions', adp, {remove: false, silent: true});
            }

        });

        return (
            < Portal.AppDevicePermissionListView collection={devicePermissions} />
        );
    }
});

Portal.AppInstallListView = React.createClass({

    itemView: Portal.AppInstallView,

    mixins: [Portal.ListView, Portal.Mixins.InstallableList],

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

    renderItem: function (appInstall) {

        var cid = appInstall.cid;

        //var appInstallCollection = this.getCollection()
        //var appInstall = appInstallCollection.get({cid: cid});

        var app = appInstall.get('app');
        var title = app.get('name');
        //var title = app.name;

        var deviceInstalls = this.props.deviceInstalls;

        var status = this.getStatus(appInstall);

        return < Portal.AppInstallView key={cid} title={title} status={status}
            deviceInstalls={deviceInstalls} model={appInstall} />
    }
});
