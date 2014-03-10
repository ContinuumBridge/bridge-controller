
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

var CBApp = require('index');

CBApp.BridgeItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    attributes : function () {
        return {
          name: this.model.get('name')
        };
    },

    template: '#bridgeItemViewTemplate',

    events: {
        'click': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    bridgeClick: function() {
        CBApp.controller.setCurrentBridge(this.model);
    },

    modelEvents: {
        'change': 'modelChange'
    },

    modelChange: function() {
        console.log('modelChange fired', this.model.get('name'), this.model.get('current'));
        this.render();
    },

    onRender: function() {

        // Show the bridge as active if it is the current bridge
        var active = this.model.get('current') ? 'active' : '';
        $(this.el).attr('class', active);
    }
});

CBApp.BridgeDropdownView = Marionette.CompositeView.extend({
    
    tagName: 'li',
    className: 'dropdown',
    itemView: CBApp.BridgeItemView,
    itemViewContainer: '#bridge-list',
    template: '#bridgeDropdownTemplate',

    initialize: function () {
        console.log('BridgeDropdownView Initialized');
    },

    onRender : function(){
      console.log("DeviceListView Rendered")
      //this.setElement('Test Html');
    }
});

CBApp.NavAccountMenuView = Marionette.ItemView.extend({

    tagName: 'li',
    attributes : function () {
        return {
          name: this.model.get('name')
        };
    },

    template: '#navAccountMenuTemplate',

    events: {
        'click #logout': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    bridgeClick: function() {
        CBApp.controller.setCurrentBridge(this.model);
    },

    modelEvents: {
        'change': 'modelChange'
    },

    modelChange: function() {
        console.log('modelChange fired', this.model.get('name'), this.model.get('current'));
        this.render();
    },

    onRender: function() {

        // Show the bridge as active if it is the current bridge
        var active = this.model.get('current') ? 'active' : '';
        $(this.el).attr('class', active);
    }
});

CBApp.NavLayoutView = Marionette.Layout.extend({

    template: '#navSectionTemplate',
    className: 'container',

    regions: {
        //bridgeDropdown: '#bridge-dropdown'
        navbarLeft: '#navbar-left',
        navbarRight: '#navbar-right'
        //bridgeDropdown: { selector: '#bridge-dropdown', regionType: CBApp.NowrapRegion }
        //bridgeList: { selector: '#bridge-list' }
    },  

    onRender: function() {
        console.log('NavLayoutView rendered', this);

        var bridgeDropdownView = new CBApp.BridgeDropdownView({
            collection: CBApp.bridgeCollection
        });
        this.navbarLeft.show(bridgeDropdownView);
    }   
});

