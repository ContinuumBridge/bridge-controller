

CBApp.StaffBridgeView = Marionette.ItemView.extend({

    //tagName: 'table',
    template: require('./templates/staffBridge.html'),

    bindings: {
        '.bridge-name': 'name',
        '.bridge-id': 'id'
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
    }
});

CBApp.BridgeView = Marionette.ItemView.extend({

    tagName: 'li',
    //className: 'new-item',
    template: require('./templates/bridge.html'),

    events: {
        'click .uninstall-button': 'uninstall'
    },

    bindings: {
        '.list-group-item-heading': 'friendly_name',
        ':el': {
          attributes: [{
            name: 'class',
            observe: 'hasChangedSinceLastSync',
            onGet: 'getClass'
          }]
        }
    },

    initialize: function() {

        this.staffView = new CBApp.StaffBridgeView({
            model: this.model
        });
    },

    getClass: function(val) {

        var enabled = this.model.get('hasChangedSinceLastSync') ? 'disabled' : 'new-item';
        //var isNew = this.model.isNew();
        //return isNew || hasChangedSinceLastSync ? 'unconfirmed' : 'new-item';
        return enabled;
    },

    uninstall: function() {
        this.model.uninstall();
    },

    onRender: function() {
        this.stickit();
        this.staffView.setElement(this.$('.staff-panel')).render();
    }
});

CBApp.BridgeListView = Marionette.CompositeView.extend({

    template: require('./templates/bridgeSection.html'),
    //tagName: 'ul',
    //className: 'animated-list',
    itemView: CBApp.BridgeView,
    itemViewContainer: '.bridge-list',

    emptyView: CBApp.ListItemLoadingView,


    events: {
        'click .discover-devices-button': 'discoverDevices'
    },

    discoverDevices: function() {
        CBApp.Config.controller.discoverDevices();
    },

    onRender : function() {

    }
});
