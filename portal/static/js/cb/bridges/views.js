
var React = require('react');

Portal.BridgeStatusView = React.createClass({

    render: function() {

        var bridge = this.props.model;
        var name = bridge.get('name');

        return (
            <div>
                <h2>Status</h2>
                <ul className="animated-list device-list">
                    <li className="panel">
                        <div className="panel-heading">
                            <table className="table">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">CBID:</th>
                                        <td>{bridge.get('cbid')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Description: </th>
                                        <td>{bridge.get('description')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Status: </th>
                                        <td>{bridge.get('status') + bridge.get('status_message')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
});

/*
Portal.BridgeView = Marionette.ItemView.extend({

    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/bridge.html'),

    events: {
        'click .uninstall-button': 'uninstall'
    },

    bindings: {
        '.list-group-item-heading': 'friendly_name',
        ':el': {
          attributes: [{
            name: 'class',
            observe: 'hasChangedSinceLastSync',
            onGet: 'getClass'
          }]
        }
    },

    initialize: function() {

        this.staffView = new Portal.StaffBridgeView({
            model: this.model
        });
    },

    getClass: function(val) {

        var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : 'new-item';
        //var isNew = this.model.isNew();
        //return isNew || hasChangedSinceLastSync ? 'unconfirmed' : 'new-item';
        return enabled;
    },

    uninstall: function() {
        this.model.uninstall();
    },

    onRender: function() {
        this.stickit();
        this.staffView.setElement(this.$('.staff-panel')).render();
    }
});

Portal.BridgeListView = Marionette.CompositeView.extend({

    template: require('./templates/bridgeSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: Portal.BridgeView,
    itemViewContainer: '.bridge-list',

    emptyView: Portal.ListItemLoadingView,


    events: {
        'click .discover-devices-button': 'discoverDevices'
    },

    discoverDevices: function() {
        Portal.Config.controller.discoverDevices();
    },

    onRender : function() {

    }
});
*/
