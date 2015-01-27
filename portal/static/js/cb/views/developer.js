

module.exports = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    componentWillReceiveParams: function(params) {

        if (this.action != params.action) {
            if (params.action == 'discover-devices') {
                this.discoverDevices();
            }
            this.action = params.action;
        }
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

        /*
        var clientControls = currentBridge.get('clientControls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });
        */

        return (
            <div>
                {this.renderModals()}
                <div className="row">
                    <div ref="appSection" className="app-section col-md-6">
                        <Portal.AppInstallListView key={currentBridge.cid}
                            collection={appInstalls} deviceInstalls={deviceInstalls} />
                    </div>
                    <div ref="deviceSection" className="device-section col-md-6">
                        {deviceView}
                    </div>
                </div>
                <div className="row">
                    <div ref="messageSection" className="message-section col-md-6">
                        <Portal.MessageListView key={currentBridge.cid}
                            collection={messages} />
                    </div>
                    <div ref="bridgeSection" className="bridge-section col-md-6"></div>
                </div>
            </div>
        )
    }
});

