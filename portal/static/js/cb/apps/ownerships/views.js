

Portal.AppOwnershipView = React.createClass({

    mixins: [ Portal.ConnectorMixin, Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'delete',
                onClick: this.disown
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    disown: function() {

        this.toggleExistenceOnServer(this.props.model);
    },

    renderBody: function() {

        var self = this;

        //var devicePermissions = this.props.devicePermissions;
        var deviceInstalls = this.props.deviceInstalls;
        var appInstall = this.props.model;

        var devicePermissions = appInstall.get('devicePermissions');

        deviceInstalls.each(function(deviceInstall) {

            var adp;
            var adpData = {
                deviceInstall: deviceInstall,
                appInstall: appInstall
            }
            adp = devicePermissions.findWhere(adpData)
            if (!adp) {
                adp = new Portal.AppDevicePermission(adpData);
                appInstall.set('devicePermissions', adp, {remove: false});
            }
        });

        return (
            < Portal.AppDevicePermissionListView collection={devicePermissions} />
        );
    }
});

Portal.AppOwnershipListView = React.createClass({

    itemView: Portal.AppOwnershipView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Apps I Own',
            buttons: [{
                name: 'Create New App',
                onClick: this.createApp,
                type: 'bold'
            }]
        };
    },

    createApp: function() {
        Portal.router.setParams({action: 'create-app'});
    },

    renderItem: function (item) {
        console.log('appInstallView createItem item', item);
        var cid = item.cid;

        var appOwnershipCollection = this.getCollection()
        var appOwnership = appOwnershipCollection.get({cid: cid});

        var app = appOwnership.get('app');
        var title = app.get('name');

        return < Portal.AppOwnershipView key={cid} title={title}
                    model={appOwnership} />
    }
});



/*
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
*/
