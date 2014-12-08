
require('../device_permissions/views');

Portal.AppInstallView = React.createClass({
    mixins: [Portal.ItemView],
    //mixins: [Portal.ItemView],
    getTitle: function() {
        console.log('getTitle model is', this.props.model)
        //console.log('getTitle this.getModel', this.getModel());
        return this.props.model.title;
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    renderBody: function() {

        console.log('AppInstallView render body', this);

        var model = this.getModel();

        console.log('AppInstallView render model', model);

        var devicePermissions = this.props.devicePermissions;
        var deviceInstalls = this.props.deviceInstalls;
        var appInstall = this.props.appInstall;

        deviceInstalls.each(function(deviceInstall) {

            if(!devicePermissions.get({deviceInstall: deviceInstall})) {
                var permission = new Portal.AppDevicePermission({
                    deviceInstall: deviceInstall,
                    appInstall: appInstall
                });
                console.log('permission is', permission );
                devicePermissions.add(permission);
            }
        });

        return (
            < Portal.AppDevicePermissionListView collection={devicePermissions} />
        );
    },

    /*

    getInitialState: function() {
        return {
            title: 'Apps'
        };
    }
    */
});

Portal.AppInstallListView = React.createClass({

    itemView: Portal.AppInstallView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getDefaultProps: function () {
        return {
            title: 'Apps',
            buttons: [{
                name: 'Install Apps'
            }]
        };
    },

    createItem: function (item) {
        var cid = item.cid;
        var collection = this.getCollection();
        var appInstall = collection.get({cid: cid});
        var app = appInstall.get('app');
        var deviceInstalls = this.props.deviceInstalls;
        var devicePermissions = appInstall.get('devicePermissions');
        var title = app.get('name');

        return < Portal.AppInstallView key={cid} title={title} appInstall={item}
                    deviceInstalls={deviceInstalls} devicePermissions={devicePermissions} model={item} />
    }
});

/*
Portal.AppInstallView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/appInstall.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .uninstall-button': 'uninstall'
    },

    initialize: function() {

        this.staffView = new Portal.StaffAppInstallView({
            model: this.model
        });
        this.staffView.licenceOwner = this.model.get('licence').get('user');
        this.appDevicePermissionListView =
            new Portal.AppDevicePermissionListView({
                appInstall: this.model
            });
    },

    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "AID" + app.get('id');
      return data;
    },

    uninstall: function() {

        console.log('uninstall in install view', this.model);
        this.model.uninstall();
    },

    onRender : function(){

        console.log('AppInstallView render', this);
        var self = this;

        this.staffView.setElement(this.$('.staff-panel')).render();

        Portal.getCurrentBridge().fetch(function(currentBridge) {

            console.log('AppInstall', currentBridge);
            var deviceInstalls = currentBridge.get('deviceInstalls');
            self.appDevicePermissionListView.setCollection(deviceInstalls);
            var $appConfig = self.$('.user-panel');
            console.log('$appConfig is', $appConfig);
            self.appDevicePermissionListView.setElement($appConfig).render();
        }).done();
    }
});

Portal.StaffAppInstallView = Marionette.ItemView.extend({

    tagName: 'table',
    template: require('./templates/staffAppInstall.html'),

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
        if (this.licenceOwner) {
            this.stickit(this.licenceOwner, this.licenceOwnerBindings);
        }
    }
});

Portal.AppInstallListView = Marionette.CompositeView.extend({

    template: require('./templates/appInstallSection.html'),
    itemView: Portal.AppInstallView,
    itemViewContainer: '.app-list',

    emptyView: Portal.ListItemLoadingView,

    events: {
        'click #install-apps': 'showLicences'
    },

    showLicences: function() {
        console.log('click showLicences');
        Portal.Config.controller.showAppLicences();
    },

    onRender : function(){

    }
});

*/