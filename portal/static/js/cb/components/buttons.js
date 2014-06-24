
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('./components');

CBApp.Components.Button = Marionette.ItemView.extend({

    tagName: 'button',

    events: {
        'click': 'onClick'
    },

    bindings: {
        ':el': {
            attributes: [{
                name: 'class',
                observe: ['change', 'change:relational'],
                onGet: 'getClass'
            }],
            observe: ['change', 'change:relational', 'isGhost'],
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

        return "btn btn-default " + enabled + " " + extraClass;
    },

    getEnabled: function(val) {

        var enabled = this.model.unsavedAttributes() ? 'disabled' : '';
        return enabled;
    }
});
