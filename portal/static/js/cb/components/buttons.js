
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
            observe: ['change', 'change:relational', 'content'],
            onGet: 'getContent'
        }
    },

    getClass: function() {

        var enabled = this.getEnabled() || "";

        return "btn btn-default " + enabled;
    }
})