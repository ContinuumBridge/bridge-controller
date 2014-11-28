
require('./components');

Portal.Components.Button = Marionette.ItemView.extend({

    tagName: 'button',

    events: {
        'click': 'onClick'
    },

    bindings: {
        ':el': {
            attributes: [{
                name: 'class',
                observe: ['isGhost'],
                modelEvents: ['change', 'change:relational', 'unsavedChanges'],
                onGet: 'getClass'
            }],
            observe: ['isGhost'],
            modelEvents: ['change', 'change:relational', 'unsavedChanges'],
            onGet: 'getContent'
        }
    },
    /*
    getTemplate: function() {

        // Return a blank template so that one does not have to be specified
        return _.template(' ');
    },
    */

    getClass: function() {

        var enabled = this.getEnabled() || "";
        var extraClass = this.extraClass || "";
        console.log('Button getClass', enabled);

        return "btn btn-default " + enabled + " " + extraClass;
    },

    getEnabled: function(val) {

        var enabled = this.model.unsavedAttributes() ? 'disabled' : '';
        console.log('Button getEnabled', this.model.unsavedAttributes());
        return enabled;
    }
});
