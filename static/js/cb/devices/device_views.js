
CBApp.DeviceView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'list-group-item',
    className: 'new-item',
    template: '#deviceItemViewTemplate',

    events: {
        'click .uninstall-button': 'uninstall',
        //'click #interest-button': 'interestButtonClick',
    },

    uninstall: function() {
        this.model.uninstall();
    },

    serializeData: function() {

      var data = {}; 
      // The label is the first four letters of the mac address
      //var device_install = this.model.get('device_install');
      //var mac_addr = device_install.mac_addr;
      data.label = this.model.get('friendly_name');
      return data;
    }
});


CBApp.DeviceListView = Marionette.CollectionView.extend({
    
    //tagName: 'table',
    tagName: 'ul',
    //className: 'list-group',
    className: 'animated-list',
    itemView: CBApp.DeviceView,

    //initialize: function(){
    //  this.listenTo(this.collection, "sort", this.renderCollection);
    //},

    onRender : function(){
      console.log("DeviceListView Rendered")
      
    },

    //appendHtml: function(collectionView, itemView){
    //  collectionView.$("tbody").append(itemView.el);
    //}

});

CBApp.DeviceLayoutView = Marionette.Layout.extend({

    template: '#deviceSectionTemplate',

    events: {
        'click #connect-device': 'discover',
        //'click #interest-button': 'interestButtonClick',
    },

    regions: {
        deviceList: '#device-list',
    },

    discover: function() {

        window.socket.emit('message', '{"msg": "cmd", "body": "discover"}', function(data){
            console.log(data);
        });
    },

    onRender: function() {
        console.log('DeviceLayoutView rendered', this);

        //CBApp.filteredDeviceCollection.where();

        //var CBApp.filterFunction = function(item){ return item; }
        //CBApp.filteredDeviceCollection.filter(CBApp.filterFunction);

        var deviceListView = new CBApp.DeviceListView({ 
            collection: this.collection
        });
        
        this.deviceList.show(deviceListView);

        /*
        CBApp.filteredDeviceCollection.filter(function(item) {
            
            //if (item.name == 'Test Device 1') {
                return item;
            //}
        });
        */
    }
})
/*
window.DevicesWrapperView = Backbone.Layout.extend({
        
    id: 'devicesWrapper',
    className: 'span4',
    template: '#devicesWrapperTemplate',

    
    events: {
        'click #connect-device': 'connectDevice',
        //'click #interest-button': 'interestButtonClick',
    },
    
    initialize: function() {

        _.bindAll(this, 'render');


    },
    
    connectDevice: function() {

        //alert('connectDevice was clicked');
        window.socket.emit('message', '{"msg": "cmd", "body": "discover"}', function(data){
            console.log(data);
        });
        
    },

    beforeRender: function() {
        
        this.deviceList = this.setView('#deviceList', new DeviceListView({
            collection: window.deviceCollection,
        }), true);
        
    },

});
*/
    
