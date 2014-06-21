
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

    bindings: {
        '.header-text': 'name'
    },

    initialize: function () {

        var self = this;

    },

    collectionEvents: {
        //'add': 'addBridge'
    },

    addBridge: function() {

        //CBApp.getCurrentBridge()
        this.render();
    },

    onRender : function(){

        var self = this;

        CBApp.getCurrentBridge().then(function(currentBridge){

            self.model = currentBridge;
            self.listenToOnce(self.model, 'change', self.render);
            //self.model.bind('change', self.render);
            self.stickit();
        });
    }
});

CBApp.Nav.AccountDropdownView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'dropdown',

    template: require('./templates/accountDropdown.html'),

    bindings: {
        '.header-text': 'name'
    },

    events: {
        //'click #logout': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    serializeData: function(){
        return {
            "logout-url": "test-link"
        }
    },

    onRender: function() {
        /*
        // Get rid of that pesky wrapping-div.
        // Assumes 1 child element present in template.
        this.$el = this.$el.children();
        // Unwrap the element to prevent infinitely
        // nesting elements during re-render.
        this.$el.unwrap();
        this.setElement(this.$el);
        */
    }
});

/*
CBApp.Nav.RightLayoutView = Marionette.Layout.extend({

    template: require('./templates/navRightSection.html'),
    className: 'container',

    regions: {
        accountMenu: '#account-menu'
    },

    initialize: function() {

        var currentUser = CBApp.getCurrentUser();
        var navAccountMenuView = new CBApp.Nav.AccountMenuView({
            model: currentUser
        });
    },

    onRender: function() {

        this.accountMenu.show(navAccountMenuView);
    }
});
*/

CBApp.Nav.TopBarView = Marionette.ItemView.extend({

    template: require('./templates/navSection.html'),
    className: 'container',

    /*
    regions: {
        navbarLeft: '#navbar-left',
        navbarRight: '#account-dropdown'
    },
    */

    onRender: function() {

        var $navbarLeft = this.$('#navbar-left');
        this.bridgeDropdownView = new CBApp.Nav.BridgeDropdownView({
            collection: CBApp.bridgeCollection
        });
        $navbarLeft.append(this.bridgeDropdownView.render().$el);

        /*
        var $navBarRight = this.$('navbar-right');
        this.accountDropdownView = new CBApp.Nav.AccountDropdownView({
            collection: CBApp.currentUserCollection
        });
        $navBarRight.append(this.accountDropdownView.render().$el);
        */

        //this.navbarLeft.show(bridgeDropdownView);
        //this.navbarRight.show(accountDropdownView);
    }
});


