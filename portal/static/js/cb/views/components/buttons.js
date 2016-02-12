
var React = require('react');

require('../mixins/connector');
var InstallableMixin = require('../mixins/installable');

module.exports.InstallButton = React.createClass({

    mixins: [Backbone.React.Component.mixin, InstallableMixin],

    handleClick: function() {

        var model = this.props.model;
        var status = model.get('status');

        if (!model.isSyncing()) {

            if (model.get('isGhost') || status == 'should_uninstall') {

                //console.log('install.isNew()', model.isNew());

                model.set('status', 'should_install');

                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: model.__proto__.constructor.modelType,
                    payload: model
                });

            } else { //if (status == 'should_uninstall' || status == 'uninstalling') {

                //console.log('install installing', status);

                model.set('status', 'should_uninstall');
                model.save();

            }
        }
        //this.toggleExistenceOnServer(this.props.model);
    },

    render: function() {

        //var contents = "Install";
        //var contents = <Spinner />
        //console.log('Install button model', this.props);
        //<div class="install-component btn btn-default app-install-button">Uninstall</div>
        var model = this.props.model;
        //console.log('install button model ', model );

        var syncing = model.isSyncing();
        var status = model.get('status');
        var label;
        var disabled = false;
        //console.log('install button model.get(isGhost)', model.get('isGhost'));
        //console.log('status ', status );
        if (model.get('isGhost') || status == "should_uninstall") {

            label = syncing ? "Uninstall" : "Install";
        } else {

            //console.log('this.errorStatusHash', this.errorStatusHash);
            label = syncing ? "Install" : "Uninstall";
        }

        if (syncing) disabled = true;

        //console.log('label ', label );
        //var label = model.get('isGhost') ? "Install" :
        //var disabled = model.isSyncing() ? 'disabled' : '';
        var buttonClass = "btn btn-default ";// + disabled;

        return (
            <div className={buttonClass} disabled={disabled} onClick={this.handleClick} >
                {label}
            </div>
        )
    }
});

// Code below is for a simple add/remove based on current thereness and sync
/*
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
*/

