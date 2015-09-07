

Portal.AppLicenceView = React.createClass({

    // Used in the App Market

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'delete',
                onClick: this.delete
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    delete: function() {

        this.toggleExistenceOnServer(this.props.model);
    },

    renderBody: function() {

        var self = this;

        return (
            <div></div>
        );
    }
});

Portal.AppLicenceListView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'My App Licences'
            /*
            buttons: [{
                name: 'Install Apps',
                onClick: this.installApps,
                type: 'bold'
            }]
            */
        };
    },

    renderItem: function (item) {
        console.log('appLicenceView createItem item', item);
        var cid = item.cid;

        var appLicenceCollection = this.getCollection()
        var appLicence = appLicenceCollection.get({cid: cid});

        var app = appLicence.get('app');
        var title = app.get('name');

        var installs = appLicence.get('installs');

        return < Portal.AppLicenceView key={cid} title={title}
                 model={appLicence} installs={installs} />
    }
});

Portal.AppLicenceRowView = React.createClass({

    // Used for installing apps modal in config

    render: function() {

        var self = this;

        var licence = this.props.model;
        var installsRemaining = licence.getInstallsRemaining();
        var installsPermitted = licence.get('installs_permitted');

        var name = this.props.name;
        //var description = this.props.description;
        var description = "test";
        var appInstall = this.props.appInstall;
        console.log('AppLicenceView props', this.props);

        var canInstall = installsPermitted > 0;
        var installButton = canInstall ? <Portal.Components.InstallButton model={appInstall} />
                            : '';

        return (
            <tr>
                <td className="app-name">
                    <div>
                        <React.OverlayTrigger placement='top'
                            overlay={<React.Tooltip>{description}</React.Tooltip>}>
                            <div>{name}</div>
                        </React.OverlayTrigger>
                    </div>
                </td>
                <td className="installs-permitted">{installsPermitted}</td>
                <td className="installs-remaining">{installsRemaining}</td>
                <td>{installButton}</td>
            </tr>
        );
    }
});

Portal.AppLicenceTableView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    getInitialState: function () {
        return {
            title: 'Apps'
        };
    },

    createItem: function (item) {
        var cid = item.cid;

        var appLicenceCollection = this.getCollection()
        var licence = appLicenceCollection.get({cid: cid});

        var app = licence.get('app');
        var name = app.get('name');
        var description = app.get('description');

        var appInstall = licence.getInstall(this.props.bridge);

        return < Portal.AppLicenceRowView key={cid} name={name}
                    description={description}
                    appInstall={appInstall} model={licence} />
    },

    render: function() {

        return (
            <div>
                <h4>My Licences</h4>
                <React.OverlayTrigger placement='top'
                    overlay={<React.Tooltip>test</React.Tooltip>}>
                    <div>Test</div>
                </React.OverlayTrigger>
                <React.Table>
                    <thead>
                        <td className="col-md-6">
                            <div className="list-group-item-heading app-name">App Name</div>
                        </td>
                        <td className="col-md-2">
                            <div className="installs-permitted">Installs permitted</div>
                        </td>
                        <td className="col-md-2">
                            <div className="installs-remaining">Installs remaining</div>
                        </td>
                        <td className="col-md-2">
                        </td>
                    </thead>
                    <tbody>
                        {this.props.collection.map(this.createItem)}
                    </tbody>
                </React.Table>
            </div>
        )
    }
});

/*
Portal.AppLicenceNestedRowView = React.createClass({

    // Used in developer section

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

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

        return (
            < Portal.AppDevicePermissionListView collection={devicePermissions} />
        );
    }
});

Portal.AppLicenceNestedTableView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.TableView ],

    getInitialState: function () {
        return {
            title: 'Licences'
        };
    },

    renderHeader: function() {

        var userCollection = this.getCollection();

        return (
            <div className="form-group form-group-sm">
                <Portal.Components.SearchInput collection={userCollection} />
            </div>
        )
        //<input className="form-control" type="text" value={searchString} />
    },

    renderRow: function (item) {
        console.log('UserLicenceTableView createItem item', item);
        var cid = item.cid;

        //var app = this.props.app;

        var licenceCollection = this.getCollection();
        var licence = licenceCollection.get({cid: cid});

        var user = licence.get('user');
        var userName = user.get('first_name') + " " + user.get('last_name');
        //var appLicence = app.getLicence(user);
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
*/

