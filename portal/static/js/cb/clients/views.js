
Portal.ClientView = Marionette.ItemView.extend({
    
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


Portal.ClientListView = Marionette.CompositeView.extend({

    template: require('./templates/clientSection.html'),
    itemView: Portal.ClientView,
    itemViewContainer: '.client-list',

    emptyView: Portal.ListItemLoadingView,


    events: {
        'click .add-client': 'addClient'
    },

    addClient : function() {
        Portal.Config.controller.addClient();
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

