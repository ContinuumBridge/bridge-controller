
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/buttons');

CBApp.AppOwnershipView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/ownership.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click .install-button': 'toggleCurrentInstall'
    },

    bindings: {
        '.installs-permitted': 'installs_permitted'
    },

    appBindings: {
        '.app-name': 'name',
        '.edit-button': {
            attributes: [{
                name: 'data-target',
                observe: 'cbid'
            }]
        },
        '.app-config': {
            attributes: [{
                name: 'id',
                observe: 'cbid'
            }]
        }
    },

    appOwnershipBindings: {
        '.installs-remaining': {
            observe: ['change', 'change:relational', 'isGhost'],
            onGet: 'getInstallsRemaining'
        }
    },

    initialize: function() {

        var self = this;

        this.app = this.model.get('app');

        CBApp.getCurrentBridge().then(function(currentBridge){

            /*
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
             */
            //self.render();
        }).done();
    },

    onRender : function() {

        var self = this;

        console.log('AppOwnershipView render', this);
        this.stickit();
        //this.stickit(this.app, this.appBindings);
    }
});


CBApp.AppOwnershipListView = Marionette.CompositeView.extend({

    template: require('./templates/ownershipSection.html'),
    itemView: CBApp.AppOwnershipView,
    itemViewContainer: '.app-list',

    emptyView: CBApp.ListItemLoadingView,

    onRender : function(){

        console.log('AppLicenceListView', this.collection);
    }
});
