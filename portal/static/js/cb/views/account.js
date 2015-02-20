
require('../users/current/views');
require('../apps/licences/views');

module.exports = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    renderModals: function () {

        /*
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
        */
    },

    render: function() {

        /*
        var currentUser = Portal.currentUser;

        var appOwnerships = currentUser.get('appOwnerships')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        var clientControls = currentUser.get('clientControls')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });
        */
        var currentUser = Portal.currentUser;

        var appLicences = currentUser.get('appLicences')
            .getFiltered('isNew', function(model, searchString) {
                return !model.isNew();
            });

        return (
            <div>
                {this.renderModals()}
                <div className="row">
                    <div ref="profileSection" className="col-md-6">
                        <Portal.CurrentUserView model={currentUser} />
                    </div>
                    <div ref="appSection" className="col-md-6">
                        <Portal.AppLicenceListView collection={appLicences} />
                    </div>
                </div>
            </div>
        )
    }
});

