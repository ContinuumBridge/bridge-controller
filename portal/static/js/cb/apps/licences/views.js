
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/buttons');

CBApp.Components.AppInstallButton = CBApp.Components.Button.extend({

    //className: 'btn btn-default install-button',

    extraClass: "app-install-button",

    template: require('./templates/button.html'),


    initialize: function() {

    },

    /*
    getEnabled: function(val) {

        console.log('getEnabled called', val);
        //var isNew = this.model.isNew();
        var enabled = this.model.unsavedAttributes() ? '' : 'disabled';
        //var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : '';

        return enabled;
    },
    */

    getContent: function() {

        var self = this;
        console.log('in getContent');

        if (this.model) {
            console.log('in getContent appInstall');

            var isInstalled = this.model.get('isGhost') ? 'Install' : 'Uninstall';
        }

        return isInstalled || '...';
    },

    onClick: function() {

        var self = this;
        console.log('onClick');
        this.model.toggleInstalled();
        /*
        CBApp.getCurrentBridge().then(function(currentBridge){
            console.log('onClick promise');
            self.model.toggleInstall(currentBridge);
            console.log('onClick promise 2');
        });
        */
    },

    onRender: function() {


        console.log('render InstallButton' , this.model);
        //this.stickit();

        //this.$('.install-component').html(this.render().$el);
    }
});

CBApp.AppLicenceView = Marionette.ItemView.extend({

    tagName: 'tr',
    //className: 'row',
    template: require('./templates/licence.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click .install-button': 'toggleCurrentInstall'
    },

    bindings: {
        '.installs-permitted': 'installs_permitted'
    },

    appBindings: {
        '.app-name': 'name'
    },

    appInstallBindings: {
        '.installs-remaining': {
            observe: ['change', 'change:relational', 'isGhost'],
            onGet: 'getInstallsRemaining'
        }
    },

    initialize: function() {

        var self = this;

        this.app = this.model.get('app');
        console.log('app in initialize is', this.app, this);

        this.installButton = new CBApp.Components.AppInstallButton();

        CBApp.getCurrentBridge().then(function(currentBridge){

            self.installButton.bridge = currentBridge;
            self.appInstall = CBApp.appInstallCollection.findOrAdd({
                app: self.app,
                bridge: currentBridge,
                licence: self.model
            });
            // Trigger change events on the model, to cause the view to update
            self.listenTo(self.appInstall, 'all', function(e) {
                console.log('event on appInstall', e);
            });

            self.stickit(self.appInstall, self.appInstallBindings);

            self.installButton.setModel(self.appInstall);
            self.installButton.stickit();
            //self.render();
        }).done();
    },

    getInstallsRemaining: function() {

        //return "Test ir";
        console.log('getInstallsRemaining');
        console.log('getInstallsRemaining model', this.appInstall);
        return this.model.getInstallsRemaining();
    },

    onRender : function() {

        var self = this;

        console.log('AppLicenceView render', this);
        this.stickit();
        this.stickit(this.app, this.appBindings);

        if (this.appInstall) {
        }

        var $installComponent = this.$('.install-component');
        console.log('installComponent', $installComponent);
        //$installComponent.html(this.installButton.render().$el);
        this.installButton.setElement($installComponent).render();
        //this.installButton.setElement(this.$('.install-component')).render();
    }
});

CBApp.AppLicenceListView = Marionette.CompositeView.extend({

    template: require('./templates/licenceSection.html'),
    itemView: CBApp.AppLicenceView,
    //itemViewContainer: 'tbody',

    emptyView: CBApp.ListItemLoadingView,

    appendHtml: function(collectionView, itemView){
        collectionView.$("tbody").append(itemView.el);
    },

    onRender : function(){

        console.log('AppLicenceListView', this.collection);
    }
});
