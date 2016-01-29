
var React = require('react');

require('../mixins/connector');

module.exports.InstallButton = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.ConnectorMixin],

    handleClick: function() {
        this.toggleExistenceOnServer(this.props.model);
    },

    render: function() {

        //var contents = "Install";
        //var contents = <Spinner />
        //console.log('Install button model', this.props);
        //<div class="install-component btn btn-default app-install-button">Uninstall</div>
        var model = this.props.model;
        console.log('install button model ', model );

        var syncing = model.isSyncing();
        var label;
        console.log('install button model.get(isGhost)', model.get('isGhost'));
        if (model.get('isGhost')) {
            label = syncing ? "Uninstall" : "Install";
        } else {
            label = syncing ? "Install" : "Uninstall";
        }
        console.log('label ', label );
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

