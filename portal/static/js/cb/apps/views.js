
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('./device_permissions/views');

CBApp.AppView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/app.html'),

    events: {
        //'click': 'eventWrapperClick',
        'click .inc': 'incrementInstallsPermitted',
        'click .dec': 'decrementInstallsPermitted'
    },



    initialize: function() {
        // Proxy change events for stickit
        var self = this;

        CBApp.getCurrentUser().then(function(currentUser) {

            console.log('currentUser in app view is', currentUser);
            console.log('self in app view is', self);
            // Create or find a licence, then bind to it
            self.licence = CBApp.AppLicence.findOrCreate({
                app: self.model,
                user: currentUser
            });
            CBApp.appLicenceCollection.add(self.licence);
            console.log('Licence in app view 2 is', self);

            var licenceBindings = {
                '.installs-permitted': {
                  attributes: [{
                    name: 'disabled',
                    observe: ['installs_permitted', 'change'],
                    onGet: 'getDisabled'
                  }]
                }
            };

            self.stickit(self.licence, licenceBindings);
        });

        this.model.on('unsavedChanges sync', function(e) {
            self.model.trigger('change:change');
        }, this);
    },
    /*
    serializeData: function() {

      var data = {};
      var app = this.model.get('app');
      data.name = app.get('name');
      data.appID = "APPID" + app.get('id');
      return data;
    },
    */
    incrementInstallsPermitted: function() {

        this.licence.changeInstallsPermitted(1);
    },

    decrementInstallsPermitted: function() {

        this.licence.changeInstallsPermitted(-1);
    },

    getDisabled: function() {

        return this.licence.unsavedAttributes() ? true : false;
    },

    onRender : function(){

        var self = this;


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
