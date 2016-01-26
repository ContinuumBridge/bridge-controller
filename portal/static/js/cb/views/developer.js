
var Backbone = require('backbone-bundle');
var React = require('react');
var Router = require('react-router');

require('../apps/ownerships/views');
require('../clients/controls/views');

module.exports = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    fetchData: function() {

        Portal.appOwnershipCollection.fetch({data: { 'user': 'current' }});
        Portal.clientControlCollection.fetch({data: { 'user': 'current' }});
    },

    componentDidMount: function() {
        this.fetchData();
    },

    componentDidUpdate: function(prevProps) {

        //console.log('developer will receive params', params);
        console.log('developer will receive this.params', this.props.params);
        if (!this.props.params || this.props.params != prevProps.params) {
            this.fetchData();
        }

        /*
        this.params = params;
        if (this.action != params.action) {
            if (params.action == 'discover-devices') {
                this.discoverDevices();
            }
            this.action = params.action;
        }
        */
    },

    renderModals: function () {

        /*
        //var action = this.getParams().action;
        //var itemID = this.getParams().item;
        var action = this.props.params.action;
        var itemID = this.props.params.item;
        console.log('renderModals params', action);
        switch (action) {
            case "install-app":
                return <InstallAppModal container={this} />;
                break;
            case "install-device":
                var discoveredDevice = Portal.discoveredDeviceCollection.getID(itemID);
                return <InstallDeviceModal container={this} model={discoveredDevice} />;
                break;
            default:
                break;
        }
        */
    },

    render: function() {

        var currentUser = Portal.currentUser;

        var appOwnerships = currentUser.get('appOwnerships')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var clientControls = currentUser.get('clientControls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        return (
            <div>
                {this.renderModals()}
                <div className="row">
                    <div ref="appSection" className="app-section col-md-6">
                        <Portal.AppOwnershipListView key={currentUser.cid}
                            collection={appOwnerships} />
                    </div>
                    <div ref="clientSection" className="client-section col-md-6">
                        <Portal.ClientControlListView key={currentUser.cid}
                            collection={clientControls} />
                    </div>
                </div>
            </div>
        )
    }
});

