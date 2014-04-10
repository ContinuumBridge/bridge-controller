
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('bootstrap');

var CBApp = require('index');

CBApp.Nav.BridgeItemView = Marionette.ItemView.extend({
    
    tagName: 'li',

    template: require('./templates/bridgeItem.html'),

    serializeData: function(){
        return {
          "name": this.model.get('name')
        }
    },

    events: {
        'click': 'bridgeClick'
    },

    bridgeClick: function() {
        CBApp.controller.setCurrentBridge(this.model);
    },

    onRender: function() {

        // Show the bridge as active if it is the current bridge
        $(this.el).attr('class', '');
    }
});

CBApp.Nav.BridgeDropdownView = Marionette.CompositeView.extend({
    
    tagName: 'li',
    className: 'dropdown',
    itemView: CBApp.Nav.BridgeItemView,
    itemViewContainer: '#bridge-list',
    template: require('./templates/bridgeDropdown.html'),

    initialize: function () {

    },

    collectionEvents: {
        //'add': 'addBridge'
    },

    addBridge: function() {

        CBApp.getCurrentBridge()
        this.render();
    },

    onRender : function(){

    }
});

CBApp.Nav.AccountMenuView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'dropdown',

    template: require('./templates/navAccountMenu.html'),

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
    }
});

CBApp.Nav.RightLayoutView = Marionette.Layout.extend({

    template: require('./templates/navRightSection.html'),
    className: 'container',

    regions: {
        accountMenu: '#account-menu'
    },

    onRender: function() {

        var navAccountMenuView = new CBApp.Nav.AccountMenuView({
            collection: CBApp.currentUserCollection
        });

        this.accountMenu.show(navAccountMenuView);
    }
});

CBApp.Nav.TopBarLayoutView = Marionette.Layout.extend({

    template: require('./templates/navSection.html'),
    className: 'container',

    regions: {
        navbarLeft: '#navbar-left',
        navbarRight: '#navbar-right'
    },

    onRender: function() {

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


