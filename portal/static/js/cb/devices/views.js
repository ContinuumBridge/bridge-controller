
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.DeviceView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: require('./templates/deviceInstall.html'),

    events: {
        'click .uninstall-button': 'uninstall',
    },

    uninstall: function() {
        this.model.uninstall();
    },

    serializeData: function() {

      var data = {}; 
      data.label = this.model.get('friendly_name');
      return data;
    }
});


CBApp.DeviceListView = Marionette.CollectionView.extend({
    
    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.DeviceView,

    onRender : function(){

    }
});

CBApp.DeviceLayoutView = Marionette.Layout.extend({

    template: require('./templates/deviceInstallSection.html'),

    events: {
        'click #connect-device': 'discover',
    },

    regions: {
        deviceList: '#device-list',
    },

    discover: function() {

        CBApp.messageCollection.sendCommand('discover');
    },

    onRender: function() {

        var deviceListView = new CBApp.DeviceListView({ 
            collection: this.collection
        });
        
        this.deviceList.show(deviceListView);
    }
})

