
CBApp.ClientView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/client.html'),

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

    delete: function() {
        this.model.delete();
    },

    onRender: function() {
        this.stickit();
    }
});


CBApp.ClientListView = Marionette.CompositeView.extend({

    template: require('./templates/clientSection.html'),
    itemView: CBApp.ClientView,
    itemViewContainer: '.client-list',

    emptyView: CBApp.ListItemLoadingView,


    events: {
        'click .add-client': 'addClient'
    },

    addClient : function() {
        CBApp.Config.controller.addClient();
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

