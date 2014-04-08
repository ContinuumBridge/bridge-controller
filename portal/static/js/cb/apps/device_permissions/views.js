
CBApp.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'nested-item new-item',
    template: require('./templates/devicePermission.html'),

    events: {
        'change input.permission-switch': 'permissionSwitch',
    },

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
});

CBApp.AppDevicePermissionListView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.AppDevicePermissionView

});
