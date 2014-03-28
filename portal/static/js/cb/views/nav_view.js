
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('bootstrap');

var CBApp = require('index');

CBApp.Nav.BridgeItemView = Marionette.ItemView.extend({
    
    tagName: 'li',

    template: '#bridgeItemViewTemplate',
    /*
    templateHelpers: function() {
        helpers = {};
        helpers.name = "Testing 2";
        return helpers;
        /*
        name: function () {
            console.warn('templateHelper is', this);
            //return this.name;
            return "Testing!";
        }
    },

     */
    serializeData: function(){
        return {
          "name": this.model.get('name')
        }
    },

    events: {
        'click': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    bridgeClick: function() {
        CBApp.controller.setCurrentBridge(this.model);
    },

    /*
    modelEvents: {
        'change': 'modelChange'
    },

    modelChange: function() {
        console.log('change fired', this.model.get('name'), this.model.get('current'));
        this.render();
    },
    */

    onRender: function() {

        // Show the bridge as active if it is the current bridge
        //var active = this.model.get('current') ? 'active' : '';
        //$(this.el).attr('class', active);
        $(this.el).attr('class', '');
        console.log('Bridge name is', this.model);
    }
});

CBApp.Nav.BridgeDropdownView = Marionette.CompositeView.extend({
    
    tagName: 'li',
    className: 'dropdown',
    itemView: CBApp.Nav.BridgeItemView,
    itemViewContainer: '#bridge-list',
    template: '#bridgeDropdownTemplate',

    initialize: function () {
        console.log('BridgeDropdownView Initialized');
    },

    collectionEvents: {
        //'add': 'addBridge'
    },

    addBridge: function() {

        CBApp.getCurrentBridge()
        this.render();
    },

    onRender : function(){

        console.log("DeviceListView Rendered")
    }
});

CBApp.Nav.AccountMenuView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'dropdown',

    template: '#navAccountMenuTemplate',

    attributes : function () {

        return {
            name: 'Test'
        };

        var currentUser = CBApp.getCurrentUser();

        if (currentUser == false) {
            return {
                name: 'Test'
            };
        } else {
            return {
                name: CBApp.getCurrentUser().get('first_name')
            };
        }
    },

    serializeData: function(){
        return {
            "logout-url": "test-link"
        }
    },

    events: {
        //'click #logout': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    /*
    modelChange: function() {
        console.log('modelChange fired', this.model.get('name'), this.model.get('current'));
        this.render();
    },

    onRender: function() {

        //var currentUser = CBApp.getCurrentUser();

        // Show the bridge as active if it is the current bridge
        //var active = this.model.get('current') ? 'active' : '';
        //$(this.el).attr('class', active);
    }
    */
});

CBApp.Nav.RightLayoutView = Marionette.Layout.extend({

    template: '#navRightSectionTemplate',
    className: 'container',

    regions: {
        accountMenu: '#account-menu'
    },

    onRender: function() {
        console.log('NavLayoutView rendered', this);

        var navAccountMenuView = new CBApp.Nav.AccountMenuView({
            collection: CBApp.currentUserCollection
        });

        this.accountMenu.show(navAccountMenuView);
    }
});

CBApp.Nav.TopBarLayoutView = Marionette.Layout.extend({

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

        var bridgeDropdownView = new CBApp.Nav.BridgeDropdownView({
            collection: CBApp.bridgeCollection
        });

        var accountMenuView = new CBApp.Nav.AccountMenuView({
            collection: CBApp.currentUserCollection
        });

        this.navbarLeft.show(bridgeDropdownView);
        this.navbarRight.show(accountMenuView);
    }
});


