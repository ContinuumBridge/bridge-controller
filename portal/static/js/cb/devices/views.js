
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.DeviceView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/deviceInstall.html'),

    events: {
        'click .uninstall-button': 'uninstall'
    },

    /*
    computeds: {
        opacity: function() {
            //return this.model.
        },
        label: function() {
            return this.model.get('friendly_name');
        }
    },
    */

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
    /*
    serializeData: function() {

      var data = {}; 
      data.label = this.model.get('friendly_name');
      return data;
    }
    */
});


CBApp.DeviceListView = Marionette.CompositeView.extend({

    template: require('./templates/deviceInstallSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: CBApp.DeviceView,
    itemViewContainer: '#device-list',

    emptyView: CBApp.ListItemLoadingView,


    events: {
        'click #connect-device': 'discover'
    },

    discover: function() {
        console.log('click connect');
        CBApp.Config.controller.discoverDevices();
    },

    onRender : function() {

    }
});

/*
CBApp.DeviceLayoutView = Marionette.Layout.extend({


    events: {
        'click #connect-device': 'discover',
    },

    regions: {
        deviceList: '#device-list',
    },

    discover: function() {

        CBApp.messageCollection.sendMessage('command', 'discover');
    },

    onRender: function() {

        var deviceListView = new CBApp.DeviceListView({ 
            collection: this.collection
        });
        
        this.deviceList.show(deviceListView);
    }
})
 */

