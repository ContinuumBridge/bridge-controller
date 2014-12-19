
require('../../components/buttons');

require('../connections/views');

Portal.AppOwnershipView = Marionette.ItemView.extend({

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
                observe: 'cbid',
                onGet: function(value, options) {
                    return "#" + value;
                }
            }]
        },
        '.app-config': {
            attributes: [{
                name: 'id',
                observe: 'cbid'
            }]
        }
    },

    appConnectionBindings: {
        '.installs-remaining': {
            observe: ['change', 'change:relational', 'isGhost'],
            onGet: 'getInstallsRemaining'
        }
    },

    initialize: function() {

        var self = this;

        this.app = this.model.get('app');

        this.appConnectionListView =
            new Portal.AppConnectionListView({
                appOwnership: this.model
            });
    },

    onRender : function() {

        var self = this;

        Portal.getCurrentUser().then(function(currentUser) {

            var clientControls = currentUser.get('clientControls');
            self.appConnectionListView.setCollection(clientControls);
            var $clientConnections = self.$('.client-connections');
            self.appConnectionListView.setElement($clientConnections).render();
        }).done();

        console.log('AppOwnershipView render', this);
        this.stickit();
        this.stickit(this.app, this.appBindings);
    }
});


Portal.AppOwnershipListView = Marionette.CompositeView.extend({

    template: require('./templates/ownershipSection.html'),
    itemView: Portal.AppOwnershipView,
    itemViewContainer: '.app-list',

    emptyView: Portal.ListItemLoadingView,

    onRender : function(){

        console.log('AppLicenceListView', this.collection);
    }
});
