
var React = require('react');

module.exports.InstallButton = React.createClass({

    mixins: [Portal.ConnectorMixin],

    handleClick: function() {
        this.toggleExistenceOnServer(this.props.model);
    },

    render: function() {

        //var contents = "Install";
        //var contents = <Spinner />
        //console.log('Install button model', this.props);
        //<div class="install-component btn btn-default app-install-button">Uninstall</div>
        var model = this.props.model;

        var syncing = model.isSyncing();
        var label;
        if (model.get('isGhost')) {
            label = syncing ? "Uninstall" : "Install";
        } else {
            label = syncing ? "Install" : "Uninstall";
        }
        //var label = model.get('isGhost') ? "Install" :
        var disabled = model.isSyncing() ? 'disabled' : '';;
        var buttonClass = "btn btn-default " + disabled;

        return (
            <div className={buttonClass} onClick={this.handleClick} >
                {label}
            </div>
        )
    }
});

