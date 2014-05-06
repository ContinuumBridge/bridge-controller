
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.DiscoveredDeviceItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: require('./templates/discoveredDevice.html'),
    //template: '#discoveredDeviceItemViewTemplate',

    events: {
        'click': 'discoveredDeviceClick',
    },

    discoveredDeviceClick: function(e) {

        e.preventDefault();
        CBApp.Config.controller.installDevice(this.model);
    },

    serializeData: function() {

      var data = {};
      data.install = this.model.get('device') ? 'Install' : 'Request an adaptor';

      // The label is the last four letters of the mac address
      var macAddr = this.model.get('mac_addr') || "";
      data.label = macAddr.slice(macAddr.length-5);


      return data;
    }
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
