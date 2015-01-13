
require('../../../components/numbers');
//require('./device_permissions/views');

var InstallsPermittedField = Portal.Components.NumberField.extend({

    initialize: function() {

    },

    getContent: function() {

        console.log('InstallsPermittedField getContent');
        return this.model.get('installs_permitted');
    },

    increment: function() {

        this.model.changeInstallsPermitted(1);
    },

    decrement: function() {

        this.model.changeInstallsPermitted(-1);
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
    }
});

var StaffAppView = Marionette.ItemView.extend({

    tagName: 'table',
    template: require('./templates/staffApp.html'),

    bindings: {
        '.app-id': {
            observe: [],
            onGet: function() {
                return "App ID: " + this.model.get('id');
            }
        }
    },

    licenceBindings: {
        '.licence-id': {
            observe: [],
            onGet: function() {
                //return this.model.get('licence').get('id');
                return "Licence ID: " + this.licence.get('id');
            }
        }
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
        if (this.licence) {
            this.stickit(this.licence, this.licenceBindings);
        }
    }
});

var AppView = module.exports.AppView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/app.html'),

    events: {
        //'click': 'eventWrapperClick',
    },

    initialize: function() {
        // Proxy change events for stickit
        var self = this;

        this.installsPermittedField = new InstallsPermittedField();
        this.staffView = new StaffAppView();

        Portal.getCurrentUser().then(function(currentUser) {

            // Create or find a licence, then bind to it
            var licence = Portal.appLicenceCollection.findWhere({
                app: self.model,
                user: currentUser
            });

            self.licence = licence || new Portal.AppLicence({
                                                    app: self.model,
                                                    user: currentUser,
                                                    installs_permitted: 0
                                                });

            Portal.appLicenceCollection.add(self.licence);

            self.staffView.licence = self.licence;
            self.staffView.setModel(self.model);
            self.installsPermittedField.setModel(self.licence);

            self.render();
            /*
            var licenceBindings = {
                '.installs-permitted': {
                  observe: ['installs_permitted'],
                  onGet: function(installsPermitted) {
                      return installsPermitted;
                  },
                  attributes: [{
                    name: 'disabled',
                    observe: ['installs_permitted', 'change'],
                    onGet: 'getDisabled'
                  }]
                }
            };

            self.stickit(self.licence, licenceBindings);
            */
        });

        this.model.on('unsavedChanges sync', function(e) {
            self.model.trigger('change:change');
        }, this);
    },

    onRender : function(){

        var self = this;

        this.staffView.setElement(this.$('.staff-panel')).render();
        this.installsPermittedField.setElement(this.$('.installs-permitted')).render();
        /*
        self.appDevicePermissionListView =
            new Portal.AppDevicePermissionListView({
                collection: currentBridge.get('deviceInstalls'),
                appInstall: self.model
            });

        Portal.getCurrentBridge().then(function(currentBridge) {

            var appID = '#APPID' + self.model.get('app').get('id');
            $appDevicePermissionList = self.$(appID);
            $appDevicePermissionList.html(self.appDevicePermissionListView.render().$el);
        });
         */
    }
});

/*
module.exports.InstallAppView = Portal.AppView.extend({

    template: require('./templates/installApp.html'),
});
*/

module.exports.AppListView = Marionette.CompositeView.extend({

    template: require('./templates/appSection.html'),
    itemView: AppView,
    itemViewContainer: '.app-list',

    emptyView: Portal.ListItemLoadingView,

    /*
    buildItemView: function(item, ItemViewType, itemViewOptions){

        var options = _.extend({model: item}, itemViewOptions);
        var view = new ItemViewType(options);
        //view.licence = "test";
        return view;
    },
    */

    onRender : function(){

    }
});
