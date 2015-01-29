
Portal.UserLicenceView = React.createClass({

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

        /*
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
        */

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

Portal.UserLicenceTableView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.TableView ],

    getInitialState: function () {
        return {
            title: 'Licences'
        };
    },

    renderRow: function (item) {
        console.log('UserLicenceTableView createItem item', item);
        var cid = item.cid;

        var app = this.props.app;

        var userCollection = this.getCollection()
        var user = userCollection.get({cid: cid});

        var userName = user.get('first_name') + " " + user.get('last_name');
        var appLicence = app.getLicence(user);
        //var title = app.get('name');

        var installsPermitted = appLicence.get('installs_permitted');

        return (
            <tr key={cid}>
                <td className="shrink">{userName}</td>
                <td className="expand">{installsPermitted}</td>
            </tr>
        );
    }
});
