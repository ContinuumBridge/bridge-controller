
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/buttons');

CBApp.Components.InstallButton = CBApp.Components.Button.extend({

    className: 'btn btn-default install-button',

    template: require('./templates/button.html'),

    initialize: function() {

        this.model.set('content', 'initial content');
    },

    getEnabled: function(val) {

        console.log('getEnabled called', val);
        //var isNew = this.model.isNew();
        var enabled = this.model.unsavedAttributes() ? '' : 'disabled';
        //var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : '';

        return enabled;
    },

    getContent: function() {

        var self = this;
        console.log('in getContent', this.bindings);

        CBApp.getCurrentBridge().then(function(currentBridge){

            console.log('getInstallButtonContent');
            var isInstalled = self.model.testIfInstalled(currentBridge);
            console.log('isInstalled is', isInstalled );
            //var isInstalled = true;
            var content = isInstalled ? 'Uninstall' : 'Install';
            self.model.set('content', content);
        });

        return self.model.get('content');
        //return "Test button";
    },

    onClick: function() {

        var self = this;
        console.log('onClick');
        CBApp.getCurrentBridge().then(function(currentBridge){
            console.log('onClick promise');
            self.model.toggleInstall(currentBridge);
            console.log('onClick promise 2');
        });
    },

    onRender: function() {


        console.log('render InstallButton');
        this.stickit();

        //this.$('.install-component').html(this.render().$el);
    }
});

CBApp.AppLicenceView = Marionette.ItemView.extend({

    tagName: 'tr',
    //className: 'row',
    template: require('./templates/licence.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .install-button': 'toggleCurrentInstall'
    },

    bindings: {
        '.installs-permitted': 'installs_permitted',
        '.installs-remaining': {
            observe: 'change:relational',
            onGet: 'getInstallsRemaining'
        }
    },

    appBindings: {
        '.app-name': 'name'
    },

    initialize: function() {

        var self = this;

        this.app = this.model.get('app');
        console.log('app in initialize is', this.app, this);

        this.installButton = new CBApp.Components.InstallButton({
            model: this.model
        });
    },

    toggleCurrentInstall: function() {

    },

    getInstallsRemaining: function() {

        return this.model.getInstallsRemaining();
    },

    onRender : function() {

        var self = this;

        this.stickit();
        this.stickit(this.app, this.appBindings);

        this.installButton.setElement(this.$('.install-component')).render();
        //this.$('.install-component').html(this.installButton.render().$el);
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
