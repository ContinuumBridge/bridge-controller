
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../../components/switches');

/*
CBApp.Components.ConnectionSwitch = CBApp.Components.Switch.extend({

    template: require('../../components/templates/switch.html'),

    getActivation: function() {

        return this.model.isNew() ? '' : 'active';
    },

    onClick: function() {

        this.model.toggleConnection();
    },

    onRender: function() {
        this.stickit();
    }
});
*/

CBApp.AppConnectionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'inner-item',
    template: require('./templates/appConnection.html'),

    initialize: function() {

        var self = this;

        this.connectionSwitch = new CBApp.Components.ConnectionSwitch({
            model: this.model
        });

        console.log('view model is', this.model);
        //this.adpModel = this.model.getAppPermission(this.appInstall);

        // Proxy change events for stickit
        this.model.on('unsavedChanges sync', function(e) {
            self.model.trigger('change:change');
        }, this);
    },

    onRender: function() {

        console.log('render AppDevicePermissionView', this);
        this.stickit(this.deviceInstall, {'#device-name': 'friendly_name'});
        this.connectionSwitch.setElement(this.$('.connection-switch')).render();
    }
});

CBApp.AppConnectionListView = Marionette.CollectionView.extend({

    //template: require('./templates/appConnectionSection.html'),
    tagName: 'ul',
    className: '',
    itemView: CBApp.AppConnectionView,
    //itemViewContainer: '.connection-list',

    initialize: function(options) {

        this.appOwnership = options.appOwnership;
        this.app = this.appOwnership.get('app');
    },

    buildItemView: function(clientControl, ItemViewType, itemViewOptions){

        var client = clientControl.get('client');
        //if (deviceInstall.isNew()) return void 0;
        console.log('buildItemView', client);
        // Create or fetch an app device permission
        var appConnection = CBApp.appConnectionCollection.findOrAdd({
            app: this.app,
            client: client
        });
        // Set the permission field depending on whether the model is new or not
        var connected = appConnection.isNew() ? false : true;
        appConnection.set('connected', connected);
        appConnection.restartTracking();

        console.log('appConnection is', appConnection);
        // build the final list of options for the item view type
        var options = _.extend({
            model: appConnection
        }, itemViewOptions);
        // create the item view instance
        var view = new ItemViewType(options);
        // Add the device install model
        view.app = this.app;
        // Add the app install model
        view.client = client;
        return view;
    }
});
