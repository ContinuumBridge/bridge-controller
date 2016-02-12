
var Backbone = require('backbone-bundle');
var React = require('react');
var Table = require('react-bootstrap').Table;

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
        //console.log('appLicenceView createItem item', item);
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

    mixins: [Backbone.React.Component.mixin, Portal.Mixins.InstallableList],

    render: function() {

        var self = this;

        var licence = this.props.model.licence;
        var installsRemaining = licence.getInstallsRemaining();
        var installsPermitted = licence.get('installs_permitted');

        var name = this.props.name;
        var appInstall = this.props.model.appInstall;

        var status = this.getStatus(appInstall);

        var canInstall = installsPermitted > 0;
        var installButton = canInstall ? <Portal.Components.InstallButton model={appInstall} />
                            : '';

        return (
            <tr>
                <td className="app-name">{name}</td>
                <td className="installs-permitted">{installsPermitted}</td>
                <td className="installs-remaining">{installsRemaining}</td>
                <td>{status}</td>
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

    createItem: function (licence) {

        //var cid = item.cid;
        //var appLicenceCollection = this.getCollection()
        //var licence = appLicenceCollection.get({cid: cid});

        var app = licence.get('app');
        var name = app.get('name');

        var models = {
            licence: licence,
            appInstall: licence.getInstall(this.props.bridge)
        }

        return < Portal.AppLicenceRowView key={licence.cid} name={name}
                    model={models} />
    },

    render: function() {

        return (
            <div>
                <h4>My Licences</h4>

                <Table>
                    <thead>
                        <tr>
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
                        </tr>
                    </thead>
                    <tbody>
                      {this.props.collection.map(this.createItem)}
                    </tbody>
                </Table>
            </div>
        )
    }
});
