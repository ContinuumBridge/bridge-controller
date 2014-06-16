
require('../../components/switches');

CBApp.Components.PermissionSwitch = CBApp.Components.Switch.extend({

    template: require('../../components/templates/switch.html'),

    getActivation: function() {

        return this.model.isNew() ? '' : 'active';
    },

    onClick: function() {

        this.model.togglePermission();
    },

    onRender: function() {
        this.stickit();
    }
});

CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'inner-item',
    template: require('./templates/devicePermission.html'),

    initialize: function() {

        var self = this;

        this.permissionSwitch = new CBApp.Components.PermissionSwitch({
            model: this.model
        });

        console.log('view model is', this.model);
        //this.adpModel = this.model.getAppPermission(this.appInstall);

        // Proxy change events for stickit
        this.model.on('unsavedChanges sync', function(e) {
            self.model.trigger('change:change');
        }, this);
    },

    /*
    getSwitchClass: function(val) {

        console.log('getSwitchClass called', val);
        //var isNew = this.model.isNew();
        var activation = this.model.get('permission') ? 'active' : '';
        //var enabled = this.model.unsavedAttributes() ? 'disabled' : '';
        //var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : '';

        return activation + " " + enabled;
    },
    */

    togglePermission: function() {

        console.log('togglePermission was called');
        //var adp = this.deviceInstall.getAppPermission();
    },

    onRender: function() {

        console.log('render AppDevicePermissionView', this);
        this.stickit(this.deviceInstall, {'#device-name': 'friendly_name'});
        this.permissionSwitch.setElement(this.$('.permission-switch')).render();
    }
    /*
    permissionSwitch: function(e) {

        var $permissionSwitch = $(e.currentTarget);
        var val = $permissionSwitch[0].checked;

        this.model.changePermission(val);
    },

    serializeData: function() {

      var deviceFriendlyName = this.model.get('deviceInstall').get('friendly_name');
      //var permission = this.model.get('id') ? 'checked' : '';
      var id = this.model.get('id') || this.model.cid;
      //this.model.set('appDevicePermissionID', "ADPID" + id);
      var tmpl_data = _.extend(this.model.toJSON(), {deviceFriendlyName: deviceFriendlyName,
                                                     permissionChecked: this.model.get('id') ? 'checked' : '',
                                                     appDevicePermissionID: 'ADPID' + id });

      return tmpl_data;
    }
    */
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

