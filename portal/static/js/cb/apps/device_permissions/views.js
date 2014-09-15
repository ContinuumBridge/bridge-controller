
require('../../components/switches');

/*
CBApp.Components.PermissionSwitch = CBApp.Components.Switch.extend({

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

CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'inner-item',
    template: require('./templates/devicePermission.html'),

    initialize: function() {

        var self = this;

        this.permissionSwitch = new CBApp.Components.ConnectionSwitch({
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
        this.permissionSwitch.setElement(this.$('.permission-switch')).render();
    }
});

CBApp.AppDevicePermissionListView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: '',
    itemView: CBApp.AppDevicePermissionView,
    //template: require('./templates/devicePermissionSection.html'),

    initialize: function(options) {

        this.appInstall = options.appInstall;
    },

    buildItemView: function(deviceInstall, ItemViewType, itemViewOptions){

        //if (deviceInstall.isNew()) return void 0;
        console.log('buildItemView', deviceInstall);
        // Create or fetch an app device permission
        //var adp = deviceInstall.getAppPermission(this.appInstall);
        var adp = CBApp.appDevicePermissionCollection.findOrAdd({
            appInstall: this.appInstall,
            deviceInstall: deviceInstall
        });
        // Set the permission field depending on whether the model is new or not
        var permission = adp.isNew() ? false : true;
        adp.set('permission', permission);
        adp.restartTracking();

        console.log('adp is', adp);
        // build the final list of options for the item view type
        var options = _.extend({
            model: adp
        }, itemViewOptions);
        // create the item view instance
        var view = new ItemViewType(options);
        // Add the device install model
        view.deviceInstall = deviceInstall;
        // Add the app install model
        view.appInstall = this.appInstall;
        return view;
    }
});

