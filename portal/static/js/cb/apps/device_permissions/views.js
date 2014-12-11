
require('../../components/switches');

var PermissionSwitch = React.createClass({

    mixins: [Portal.ReactBackboneMixin],


    handleClick: function() {

    },

    render: function() {

        console.log('PermissionSwitch render');

        var label = this.props.label;
        return (
            <li className="inner-item">
                <div className="left theme-green animate toggle-switch active" onClick={this.handleClick}></div>
                <div className="list-label">{label}</div>
            </li>
        )
    }
});

Portal.AppDevicePermissionView = React.createClass({
    mixins: [Portal.InnerItemView],

});

Portal.AppDevicePermissionListView = React.createClass({
    mixins: [Backbone.React.Component.mixin, Portal.InnerListView],

    getDefaultProps: function () {
        return {
            title: 'Device connections'
        };
    },

    createItem: function(item) {

        //var appInstall = this.props.appInstall;
        //var devicePermissions = this.props.devicePermissions;

        console.log('AppDevicePermissionListView create item', item);
        var cid = item.cid;

        var adp = this.getCollection().get({cid: cid});;
        var label = adp.get('deviceInstall').get('friendly_name');

        //return < PermissionSwitch key={cid} label={label} model={adp} />
        return (
            <div>"createItem"</div>
        )
    }
});

/*
Portal.Components.PermissionSwitch = Portal.Components.Switch.extend({

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

Portal.AppDevicePermissionView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'inner-item',
    template: require('./templates/devicePermission.html'),

    initialize: function() {

        var self = this;

        this.permissionSwitch = new Portal.Components.ConnectionSwitch({
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

Portal.AppDevicePermissionListView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: '',
    itemView: Portal.AppDevicePermissionView,
    //template: require('./templates/devicePermissionSection.html'),

    initialize: function(options) {

        this.appInstall = options.appInstall;
    },

    buildItemView: function(deviceInstall, ItemViewType, itemViewOptions){

        //if (deviceInstall.isNew()) return void 0;
        console.log('buildItemView', deviceInstall);
        // Create or fetch an app device permission
        //var adp = deviceInstall.getAppPermission(this.appInstall);
        var adp = Portal.appDevicePermissionCollection.findOrAdd({
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

*/

