
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../components/numbers');
require('./device_permissions/views');

CBApp.Components.InstallsPermittedField = CBApp.Components.NumberField.extend({

    initialize: function() {

    },

    getDisabled: function() {

        return this.model.unsavedAttributes() ? true : false;
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

    /*
    remove: function() {

        CBApp.Components.InstallsPermittedField.prototype.remove.apply(this);
    },
    */

    setModel: function(model) {

        this.undelegateEvents();
        this.model = model;
        this.delegateEvents();
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
            this.listenTo(this.model, 'all', function(name) {
                console.log('EVENT licence', name);
            })
        }
    }
});

CBApp.AppView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/app.html'),

    events: {
        //'click': 'eventWrapperClick',
    },

    initialize: function() {
        // Proxy change events for stickit
        var self = this;

        this.installsPermittedField = new CBApp.Components.InstallsPermittedField();

        CBApp.getCurrentUser().then(function(currentUser) {

            // Create or find a licence, then bind to it
            var licence = CBApp.appLicenceCollection.findWhere({
                app: self.model,
                user: currentUser
            });

            self.licence = licence || new CBApp.AppLicence({
                                                    app: self.model,
                                                    user: currentUser
                                                });

            CBApp.appLicenceCollection.add(self.licence);

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

        this.installsPermittedField.setElement(this.$('.input-group')).render();
        /*
        self.appDevicePermissionListView =
            new CBApp.AppDevicePermissionListView({
                collection: currentBridge.get('deviceInstalls'),
                appInstall: self.model
            });

        CBApp.getCurrentBridge().then(function(currentBridge) {

            var appID = '#APPID' + self.model.get('app').get('id');
            $appDevicePermissionList = self.$(appID);
            $appDevicePermissionList.html(self.appDevicePermissionListView.render().$el);
        });
         */
    }
});

CBApp.InstallAppView = CBApp.AppView.extend({

    template: require('./templates/installApp.html'),
});

CBApp.AppListView = Marionette.CompositeView.extend({

    template: require('./templates/appSection.html'),
    itemView: CBApp.AppView,
    itemViewContainer: '#app-list',

    emptyView: CBApp.ListItemLoadingView,

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
