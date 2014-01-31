
CBApp.DiscoveredDeviceItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'list-group-item',
    className: 'new-item',
    template: '#discoveredDeviceItemViewTemplate',

    events: {
        'click': 'discoveredDeviceClick',
        //'click #interest-button': 'interestButtonClick',
    },

    discoveredDeviceClick: function(e) {

        e.preventDefault();
        //CBApp.navInstallDevice();
        CBApp.controller.installDevice(this.model);
        //var modalView = new CBApp.InstallDeviceModal();
        //$('#portal-body').html(modalView.render().el);
        //this.model.installDevice();
    }
    /*
    render: function () {
      console.log('DeviceView rendered');
      var source = $(this.template).html();
      var data = { descriptor: 'test_descriptor' };
      var compiled = _.template(source, data);
      this.$el.html(compiled);
      return this;
    }
    onRender: function(){
        
        console.log('DiscoveredDeviceView rendered');
    }
    */
});


CBApp.DiscoveredDeviceListView = Marionette.CollectionView.extend({
    
    //tagName: 'table',
    tagName: 'ul',
    //className: 'list-group',
    className: 'animated-list',
    itemView: CBApp.DiscoveredDeviceItemView,

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

CBApp.DeviceDiscoveryLayoutView = Marionette.Layout.extend({

    template: '#deviceDiscoverySectionTemplate',

    events: {
        'click #rescan': 'discover',
        //'click #interest-button': 'interestButtonClick',
    },

    regions: {
        discoveredDeviceList: '#discovered-device-list',
    },

    onRender: function() {
        console.log('DeviceDeviceLayoutView rendered', this);
        //$(this.el).html('Test html');
        var discoveredDeviceListView = new CBApp.DiscoveredDeviceListView({ collection: this.collection });
        this.discoveredDeviceList.show(discoveredDeviceListView);
    },

    discover: function() {

        window.socket.emit('message', '{"msg": "cmd", "body": "discover"}', function(data){
            console.log(data);
        }); 
    },
})

