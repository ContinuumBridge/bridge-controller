
var Backbone = require('backbone-bundle');
var React = require('react');

Portal.ClientView = React.createClass({

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

Portal.ClientListView = React.createClass({

    itemView: Portal.ClientView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Clients',
            buttons: [{
                name: 'Create Client',
                onClick: this.createClient,
                type: 'bold'
            }]
        };
    },

    createClient: function() {
        Portal.router.setParams({action: 'create-client'});
    },

    createItem: function (item) {
        var cid = item.cid;

        var appInstallCollection = this.getCollection()
        var appInstall = appInstallCollection.get({cid: cid});

        var app = appInstall.get('app');
        var title = app.get('name');

        var deviceInstalls = this.props.deviceInstalls;

        return < Portal.ClientView key={cid} title={title}
                    deviceInstalls={deviceInstalls} model={appInstall} />
    }
});

