
require('../../components/buttons');

Portal.Components.AppInstallButton = Portal.Components.Button.extend({

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

            var isInstalled = this.model.get('isGhost')
                ? 'Install' : 'Uninstall';

            var isInstalling = this.model.unsavedAttributes()
                ? '' : '';
        }

        return isInstalled + isInstalling || '...';
    },

    onClick: function() {

        var self = this;
        console.log('onClick');
        this.model.toggleInstalled();
        /*
        Portal.getCurrentBridge().then(function(currentBridge){
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

Portal.AppLicenceView = Marionette.ItemView.extend({

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

        this.installButton = new Portal.Components.AppInstallButton();

        var currentBridge = Portal.getCurrentBridge();

        this.installButton.bridge = currentBridge;
        this.appInstall = Portal.appInstallCollection.findOrAdd({
            app: this.app,
            bridge: currentBridge,
            licence: this.model
        });
        // Trigger change events on the model, to cause the view to update
        this.listenTo(this.appInstall, 'all', function(e) {
            console.log('event on appInstall', e);
        });

        this.stickit(this.appInstall, this.appInstallBindings);

        this.installButton.setModel(this.appInstall);
        this.installButton.stickit();
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

Portal.AppLicenceListView = Marionette.CompositeView.extend({

    template: require('./templates/licenceSection.html'),
    itemView: Portal.AppLicenceView,
    //itemViewContainer: 'tbody',

    emptyView: Portal.ListItemLoadingView,

    appendHtml: function(collectionView, itemView){
        collectionView.$("tbody").append(itemView.el);
    },

    onRender : function(){

        console.log('AppLicenceListView', this.collection);
    }
});
