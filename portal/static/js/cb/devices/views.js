
CBApp.DeviceOptionsView = Marionette.ItemView.extend({
    
    tagName: "tr",
    template: '#deviceOptionsTemplate',

    events: {

    },

    onRender: function(){
        
        console.log('DeviceOptionsView rendered');
        $(this.el).html('Test html');
    }
});

CBApp.DeviceView = Marionette.ItemView.extend({
    
    tagName: 'li',
    //className: 'list-group-item',
    className: 'new-item',
    template: '#deviceTemplate',

    events: {
        //'click': 'eventWrapperClick',
        //'click #interest-button': 'interestButtonClick',
    },
    /*
    render: function () {
      console.log('DeviceView rendered');
      var source = $(this.template).html();
      var data = { descriptor: 'test_descriptor' };
      var compiled = _.template(source, data);
      this.$el.html(compiled);
      return this;
    }
    */
});


CBApp.DeviceListView = Marionette.CollectionView.extend({
    
    //tagName: 'table',
    tagName: 'ul',
    //className: 'list-group',
    className: 'reminders',
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
    regions: {
        deviceList: '#device-list',
        deviceOptions: '#device-options'
    },
    onRender: function() {
        console.log('DeviceLayoutView rendered', this);
        //$(this.el).html('Test html');
        var deviceListView = new CBApp.DeviceListView({ collection: this.collection });
        var optionView = new CBApp.DeviceOptionsView({});
        
        this.deviceList.show(deviceListView);
        //this.deviceList.show(new CBApp.DeviceListView({ collection: this.collection }));
        this.deviceOptions.show(optionView);
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
    
