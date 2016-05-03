
Portal.module('Nav', function(Nav, CBApp, Backbone, Marionette, $, _) {

    require('bootstrap');

    Nav.addInitializer(function() {

        //router
        this.controller = new this.Controller();
    });

    Nav.Controller = Marionette.Controller.extend({

        showTopbar: function() {

            Nav.topbarView = new Nav.TopbarView();
            Portal.navRegion.show(Nav.topbarView);
        },
        deactivateTopbar: function() {
            console.log('deactivateTopbar');
            Nav.topbarView.deactivateSections();
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
            Portal.controller.setCurrentBridge(this.model);
        },

        onRender: function() {

            // Show the bridge as active if it is the current bridge
            $(this.el).attr('class', '');
        }
    });

    Nav.BridgeDropdownView = Marionette.CompositeView.extend({

        tagName: 'li',
        className: 'dropdown',
        itemView: Portal.Nav.BridgeItemView,
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

            //Portal.getCurrentBridge()
            this.render();
        },

        onRender : function(){

            this.model = Portal.getCurrentBridge();
            //console.log('Portal.getCurrentBridge();', Portal.getCurrentBridge());
            //this.listenToOnce(this.model, 'change', this.render);
            this.listenToOnce(Portal.bridgeCollection, 'change:current', this.render);
            //self.model.bind('change', self.render);
            this.stickit();
        }
    });

    Nav.TopbarView = Marionette.ItemView.extend({

        template: require('./templates/navSection.html'),
        className: 'container',

        ui: {
            dashboard: '.dashboard',
            home: '.home',
            store: '.store',
            config: '.config',
            developer: '.developer'
        },

        events: {
            'click @ui.dashboard': 'navigate',
            'click @ui.home': 'navigate',
            'click @ui.store': 'navigate',
            'click @ui.config': 'navigate',
            'click @ui.developer': 'navigate'
        },

        navigate: function(e) {
            console.log('navigate', e.target.className);
            var navEvent = e.target.className + ':show';
            console.log('navigate', navEvent);
            //console.log('navigate', e.target.className);
            Portal.request(navEvent);
        },

        activateSection: function(section) {

            this.deactivateAll();
            var $section = this.ui[section];
            if ($section) $section.addClass('active');
        },

        deactivateAll: function() {

            console.log('In deactivateSections, this.ui', this.ui);
            _.each(this.ui, function($section) {
                $section.removeClass('active');
            });
        },

        onRender: function() {

            var $navbarLeft = this.$('#navbar-left');
            this.bridgeDropdownView = new Nav.BridgeDropdownView({
                collection: Portal.bridgeCollection
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

        Nav.controller.activateTopbar(section);
    });

});