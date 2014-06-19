
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/buttons');

CBApp.Components.DeviceInstallButton = CBApp.Components.Button.extend({

    template: require('./templates/installButton.html'),

    extraClass: "install-button",

    initialize: function() {

    },

    onClick: function(e) {

        e.preventDefault();
        CBApp.Config.controller.installDevice(this.model);
    },

    getContent: function() {

        return this.model.get('device') ? 'Install' : 'Request an adaptor';
    },

    onRender: function() {

        this.stickit();
    }
});

CBApp.DiscoveredDeviceItemView = Marionette.ItemView.extend({
    
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

        this.installButton = new CBApp.Components.DeviceInstallButton({
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

    /*
    serializeData: function() {

      var data = {};
      data.install = this.model.get('device') ? 'Install' : 'Request an adaptor';
      // The label is the last four letters of the mac address
      var macAddr = this.model.get('mac_addr') || "";
      data.label = macAddr.slice(macAddr.length-5);
      return data;
    }
    */
});


CBApp.DiscoveredDeviceListView = Marionette.CompositeView.extend({

    template: require('./templates/discoveredDeviceSection.html'),
    itemView: CBApp.DiscoveredDeviceItemView,
    itemViewContainer: '#discovered-device-list',

    emptyView: CBApp.ListItemLoadingView,

    events: {
        'click #devices': 'clickDevices',
        'click #rescan': 'clickDiscover'
    },

    /*
    initialize: function(){

    },
    */

    clickDevices: function() {

        CBApp.Config.controller.stopDiscoveringDevices();
    },

    clickDiscover: function() {

        CBApp.Config.controller.discoverDevices();
    },

    onRender : function(){

    }
});
