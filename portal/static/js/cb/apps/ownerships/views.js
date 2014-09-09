
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/buttons');

require('../connections/views');

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
            new CBApp.AppConnectionListView({
                appOwnership: this.model
            });
    },

    onRender : function() {

        var self = this;

        console.log('AppOwnershipView render', this);
        this.stickit();
        this.stickit(this.app, this.appBindings);
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
