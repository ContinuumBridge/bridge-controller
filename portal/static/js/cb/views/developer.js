
require('../apps/ownerships/views');
require('../apps/connections/views');

require('../clients/views');
require('../clients/controls/views');

module.exports = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    componentWillReceiveParams: function(params) {

        console.log('developer will receive params', params);
        console.log('developer will receive this.params', this.params);
        if (!this.params || this.params != params) {
            console.log('developer fetch collections');
            Portal.appOwnershipCollection.fetch({data: { 'user': 'current' }});
            Portal.clientControlCollection.fetch({data: { 'user': 'current' }});
        }

        this.params = params;
        /*
        if (this.action != params.action) {
            if (params.action == 'discover-devices') {
                this.discoverDevices();
            }
            this.action = params.action;
        }
        */
    },

    renderModals: function () {

        var action = this.getParams().action;
        var itemID = this.getParams().item;
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

