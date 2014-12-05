
require('../../components/buttons');


Portal.DiscoveredDeviceView = React.createClass({
    mixins: [Portal.ItemView]
});

Portal.DiscoveredDeviceListView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function() {
        return {
            title: 'Apps'
        };
    }
});

/*
Portal.Components.DeviceInstallButton = Portal.Components.Button.extend({

    template: require('./templates/installButton.html'),

    extraClass: "install-button",

    initialize: function() {

    },

    onClick: function(e) {

        e.preventDefault();
        Portal.Config.controller.installDevice(this.model);
    },

    getContent: function() {

        return this.model.get('device') ? 'Install' : 'Request an adaptor';
    },

    onRender: function() {

        this.stickit();
    }
});

Portal.DiscoveredDeviceItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: require('./templates/discoveredDevice.html'),
    //template: '#discoveredDeviceItemViewTemplate',

    bindings: {
        '.device-address': {
            observe: ['mac_addr', 'address'],
            onGet: 'formatAddress'
        }
    },

    initialize: function() {

        this.installButton = new Portal.Components.DeviceInstallButton({
            model: this.model
        });
    },

    formatAddress: function(address) {

        // Retain backwards compatibility with using mac_addr
        var addr = address[0] || address[1];
        return addr.slice(addr.length-5);
    },

    onRender: function() {

        this.stickit();
        var device = this.model.get('device');
        this.stickit(device, {'.device-name': 'name'});

        this.installButton.setElement(this.$('.install-button')).render();
    },
});


Portal.DiscoveredDeviceListView = Marionette.CompositeView.extend({

    template: require('./templates/discoveredDeviceSection.html'),
    itemView: Portal.DiscoveredDeviceItemView,
    itemViewContainer: '#discovered-device-list',

    emptyView: Portal.ListItemLoadingView,

    events: {
        'click #devices': 'clickDevices',
        'click #rescan': 'clickDiscover'
    },

    clickDevices: function() {

        Portal.Config.controller.stopDiscoveringDevices();
    },

    clickDiscover: function() {

        Portal.Config.controller.discoverDevices();
    },

    onRender : function(){

    }
});
*/
