
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.module('Nav', function(Nav, CBApp, Backbone, Marionette, $, _) {

    require('bootstrap');

    Nav.addInitializer(function() {

        //router
        this.controller = new this.Controller();
    });

    Nav.Controller = Marionette.Controller.extend({

        showTopbar: function() {

            Nav.topbarView = new Nav.TopbarView();
            CBApp.navRegion.show(Nav.topbarView);
        },
        activateTopbar: function(section) {
            console.log('activateTopbar', section);
            Nav.topbarView.activateSection(section);
        }
    });

    Nav.BridgeItemView = Marionette.ItemView.extend({

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

    Nav.BridgeDropdownView = Marionette.CompositeView.extend({

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

    Nav.AccountDropdownView = Marionette.ItemView.extend({

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
            // Get rid of that pesky wrapping-div.
            // Assumes 1 child element present in template.
            //this.$el = this.$el.children();
            // Unwrap the element to prevent infinitely
            // nesting elements during re-render.
            //this.$el.unwrap();
            //this.setElement(this.$el);
        }
    });

    Nav.TopbarView = Marionette.ItemView.extend({

        template: require('./templates/navSection.html'),
        className: 'container',

        events: {
            'click .dashboard': 'navigate',
            'click .store': 'navigate',
            'click .config': 'navigate'
        },

        navigate: function(e) {
            console.log('navigate', e.target.className);
            var navEvent = e.target.className + ':show';
            console.log('navigate', navEvent);
            //console.log('navigate', e.target.className);
            CBApp.request(navEvent);
        },

        activateSection: function(section) {

            var $section = this.$('.' + section);
            console.log('activateSection section', section);
        },

        onRender: function() {

            var $navbarLeft = this.$('#navbar-left');
            this.bridgeDropdownView = new Nav.BridgeDropdownView({
                collection: CBApp.bridgeCollection
            });
            $navbarLeft.append(this.bridgeDropdownView.render().$el);

            //this.navbarLeft.show(bridgeDropdownView);
            //this.navbarRight.show(accountDropdownView);
        }
    });

    Nav.on('topbar:show', function() {

        Nav.controller.showTopbar();
    });

    Nav.on('topbar:activate', function(section){

        console.log('navigation section activate', section);
        Nav.controller.activateTopbar(section);
    });

});
