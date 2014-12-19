
require('./components');

Portal.Components.Switch = Marionette.ItemView.extend({

    //tagName: 'button',

    template: require('./templates/switch.html'),

    events: {
        'click': 'onClick'
    },

    bindings: {
        ':el': {
            attributes: [{
                name: 'class',
                observe: ['change', 'change:relational'],
                onGet: 'getClass'
            }]
            //observe: ['change', 'change:relational', 'content', 'permission'],
            //onGet: 'getContent'
        }
    },

    getClass: function() {

        //var enabled = this.getEnabled() || "";
        var enabled = this.model.unsavedAttributes() ? 'disabled' : '';
        var activation = this.getActivation();

        return "left theme-green animate toggle-switch " + activation + " " + enabled;
    }
});

Portal.Components.ConnectionSwitch = Portal.Components.Switch.extend({

    template: require('./templates/switch.html'),

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
