
Portal.DeviceInstallView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    getInitialState: function () {
        return {
            buttons: [{
                onClick: this.handleDestroy,
                type: 'delete'
            }]
        };
    },

    getTitle: function() {
        console.log('DeviceInstallView ', this );
        return this.props.model.friendly_name;
    }
});

Portal.DeviceInstallListView = React.createClass({

    itemView: Portal.DeviceInstallView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Devices',
            buttons: [{
                name: 'Discover Devices',
                onClick: this.discoverDevices,
                type: 'bold'
            }]
        };
    },

    discoverDevices: function() {

        Portal.Config.controller.discoverDevices();
    },

    createItem: function (item) {
        //console.log('DeviceInstallListView createItem', this.itemView);
        //console.log('DeviceInstallListView item', item);
        var cid = item.cid;

        console.log('DeviceInstallListView item', item);

        return < Portal.DeviceInstallView key={cid} title={item.friendly_name} model={item} />
    }
});

/*
Portal.DeviceInstallView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/deviceInstall.html'),

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
    }
});


Portal.DeviceInstallListView = Marionette.CompositeView.extend({

    template: require('./templates/deviceInstallSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: Portal.DeviceInstallView,
    itemViewContainer: '.device-list',

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

/*
Portal.DeviceLayoutView = Marionette.Layout.extend({


    events: {
        'click #connect-device': 'discover',
    },

    regions: {
        deviceList: '#device-list',
    },

    discover: function() {

        Portal.messageCollection.sendMessage('command', 'discover');
    },

    onRender: function() {

        var deviceListView = new Portal.DeviceListView({
            collection: this.collection
        });
        
        this.deviceList.show(deviceListView);
    }
})
 */

