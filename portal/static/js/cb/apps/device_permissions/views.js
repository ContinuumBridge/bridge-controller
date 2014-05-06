
CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'inner-item',
    template: require('./templates/devicePermission.html'),

    events: {
        'click': 'togglePermission'
        //'change input.permission-switch': 'permissionSwitch',
    },

    bindings: {
        //'#device-name': 'test'
        /*
        '#device-name': [{
            observe: 'hasChangedSinceLastSync',
            onGet: function(value) {
                return 'test';
                this.model.get('deviceInstall').get('friendly_name')
            }
        }]
        */
        '#permission-switch': {
          attributes: [{
            name: 'class',
            observe: ['permission', 'hasChangedSinceLastSync'],
            onGet: 'getSwitchClass'
          }]
        }
        /*

            observe: 'friendly_name',
            onGet: function(value) {
                console.log('value in onGet is', value);
                this.getAppPermission.get('')
            }
        */
    },

    getSwitchClass: function(val) {

        console.log('getSwitchClass called', val);
        //var isNew = this.model.isNew();
        var activation = this.model.get('permission') ? 'active' : '';
        var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : '';

        return activation + " " + enabled;
    },

    /*
    initialize: function() {

        console.log('view model is', this.model);
        //this.adpModel = this.model.getAppPermission(this.appInstall);
    },
    */

    togglePermission: function() {

        console.log('togglePermission was called');
        //var adp = this.deviceInstall.getAppPermission();
        this.model.togglePermission();
    },

    onRender: function() {
        this.stickit();
        this.stickit(this.deviceInstall, {'#device-name': 'friendly_name'});
        //this.stickit(this.model, {'#device-name': 'test'});
        console.log('deviceInstall is', this.deviceInstall);
        //this.addBinding(this.deviceInstall, '#device-name', 'friendly_name');
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

    buildItemView: function(item, ItemViewType, itemViewOptions){
        // Create or fetch an app device permission
        var adp = item.getAppPermission(this.options.appInstall);
        // build the final list of options for the item view type
        var options = _.extend({
            model: adp
        }, itemViewOptions);
        // create the item view instance
        var view = new ItemViewType(options);
        // Add the device install model
        view.deviceInstall = item;
        // Add the app install model
        view.appInstall = this.options.appInstall;
        // return it
        //console.log('adp is', adp, 'deviceInstall is', item, 'appInstall is', this.options.appInstall);
        console.log('adp is', adp.get('deviceInstall').id, adp.get('appInstall').id);
        return view;
    }
});

