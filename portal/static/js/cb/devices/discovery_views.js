
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.DiscoveredDeviceItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: '#discoveredDeviceItemViewTemplate',

    events: {
        'click': 'discoveredDeviceClick',
    },

    discoveredDeviceClick: function(e) {

        e.preventDefault();
        CBApp.controller.installDevice(this.model);
    },

    serializeData: function() {

      var data = {};
      data.install = this.model.get('device') ? 'Install' : 'Request an adaptor';

      // The label is the first four letters of the mac address
        /*
      var device_install = this.model.get('device_install');
      var mac_addr = device_install.mac_addr;
      data.label = mac_addr.substring(mac_addr.length-5, mac_addr.length-1);
         */
      var macAddr = this.model.get('mac_addr');
      data.label = mac_addr.substring(mac_addr.length-5, mac_addr.length-1);

      return data;
    }
});


CBApp.DiscoveredDeviceListView = Marionette.CollectionView.extend({
    
    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.DiscoveredDeviceItemView,

    initialize: function(){

    },

    onRender : function(){

    }
});

CBApp.DeviceDiscoveryLayoutView = Marionette.Layout.extend({

    template: '#deviceDiscoverySectionTemplate',

    events: {
        'click #rescan': 'discover'
    },

    regions: {
        discoveredDeviceList: '#discovered-device-list'
    },

    onRender: function() {
        var discoveredDeviceListView = new CBApp.DiscoveredDeviceListView({ collection: this.collection });
        this.discoveredDeviceList.show(discoveredDeviceListView);
    },

    discover: function() {

        CBApp.socket.sendCommand('discover');
    }
})

