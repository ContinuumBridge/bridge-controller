
Portal.AppLicenceView = React.createClass({

    //mixins: [Portal.ItemView],

    render: function() {

        var self = this;

        //var devicePermissions = this.props.devicePermissions;
        //var deviceInstalls = this.props.deviceInstalls;
        var licence = this.props.model;
        var name = this.props.name;

        return (
            <div>"Test licence"</div>
        );
    }
});

Portal.AppLicenceListView = React.createClass({

    itemView: Portal.AppLicenceView,

    mixins: [Backbone.React.Component.mixin],

    getInitialState: function () {
        return {
            title: 'Apps'
            /*
            buttons: [{
                name: 'Install Apps',
                type: 'bold'
            }]
            */
        };
    },

    createItem: function (item) {
        var cid = item.cid;

        var appLicenceCollection = this.getCollection()
        var licence = appLicenceCollection.get({cid: cid});

        var app = licence.get('app');
        var name = app.get('name');

        //var deviceInstalls = this.props.deviceInstalls;

        return < Portal.AppLicenceView key={cid} name={name} model={licence} />
    },

    render: function() {

        return (
            <div>
                <h4>My Licences</h4>

                <React.Table>
                    <thead>
                        <td className="col-md-6">
                            <div className="list-group-item-heading app-name">"App Name"</div>
                        </td>
                        <td className="col-md-2">
                            <div className="installs-permitted">"Installs permitted"</div>
                        </td>
                        <td className="col-md-2">
                            <div className="installs-remaining">"Installs remaining"</div>
                        </td>
                        <td className="col-md-2">
                        </td>
                    </thead>
                    <tbody>
                        <div></div>
                    </tbody>
                </React.Table>
            </div>
        )
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
/*
require('../../components/buttons');

Portal.Components.AppInstallButton = Portal.Components.Button.extend({

    //className: 'btn btn-default install-button',

    extraClass: "app-install-button",

    template: require('./templates/button.html'),


    initialize: function() {

    },

    getContent: function() {

        var self = this;
        console.log('in getContent');

        if (this.model) {
            console.log('in getContent appInstall');

            var isInstalled = this.model.get('isGhost')
                ? 'Install' : 'Uninstall';

            var isInstalling = this.model.unsavedAttributes()
                ? '' : '';
        }

        return isInstalled + isInstalling || '...';
    },

    onClick: function() {

        var self = this;
        console.log('onClick');
        this.model.toggleInstalled();

    },

    onRender: function() {


        console.log('render InstallButton' , this.model);
        //this.stickit();

        //this.$('.install-component').html(this.render().$el);
    }
});

Portal.AppLicenceView = Marionette.ItemView.extend({

    tagName: 'tr',
    //className: 'row',
    template: require('./templates/licence.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click .install-button': 'toggleCurrentInstall'
    },

    bindings: {
        '.installs-permitted': 'installs_permitted'
    },

    appBindings: {
        '.app-name': 'name'
    },

    appInstallBindings: {
        '.installs-remaining': {
            observe: ['change', 'change:relational', 'isGhost'],
            onGet: 'getInstallsRemaining'
        }
    },

    initialize: function() {

        var self = this;

        this.app = this.model.get('app');

        this.installButton = new Portal.Components.AppInstallButton();

        var currentBridge = Portal.getCurrentBridge();

        this.installButton.bridge = currentBridge;
        this.appInstall = Portal.appInstallCollection.findOrAdd({
            app: this.app,
            bridge: currentBridge,
            licence: this.model
        });
        // Trigger change events on the model, to cause the view to update
        this.listenTo(this.appInstall, 'all', function(e) {
            console.log('event on appInstall', e);
        });

        this.stickit(this.appInstall, this.appInstallBindings);

        this.installButton.setModel(this.appInstall);
        this.installButton.stickit();
    },

    getInstallsRemaining: function() {

        //return "Test ir";
        console.log('getInstallsRemaining');
        console.log('getInstallsRemaining model', this.appInstall);
        return this.model.getInstallsRemaining();
    },

    onRender : function() {

        var self = this;

        console.log('AppLicenceView render', this);
        this.stickit();
        this.stickit(this.app, this.appBindings);

        if (this.appInstall) {
        }

        var $installComponent = this.$('.install-component');
        console.log('installComponent', $installComponent);
        //$installComponent.html(this.installButton.render().$el);
        this.installButton.setElement($installComponent).render();
        //this.installButton.setElement(this.$('.install-component')).render();
    }
});

Portal.AppLicenceListView = Marionette.CompositeView.extend({

    template: require('./templates/licenceSection.html'),
    itemView: Portal.AppLicenceView,
    //itemViewContainer: 'tbody',

    emptyView: Portal.ListItemLoadingView,

    appendHtml: function(collectionView, itemView){
        collectionView.$("tbody").append(itemView.el);
    },

    onRender : function(){

        console.log('AppLicenceListView', this.collection);
    }
});
*/
