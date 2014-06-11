
require('./components');

CBApp.Components.NumberField = Marionette.ItemView.extend({

    tagName: 'button',

    template: require('./templates/numberField.html'),

    events: {
        'click .inc': 'increment',
        'click .dec': 'decrement'
    },

    bindings: {
        '.bfh-number': {
            attributes: [{
                name: 'disabled',
                observe: ['installs_permitted', 'change'],
                onGet: 'getDisabled'
            }],
            observe: ['change', 'change:relational', 'installs_permitted'],
            onGet: 'getContent'
        }
    },

    getClass: function() {

        var enabled = this.getEnabled() || "";

        return "form-control bfh-number app-form-input installs-permitted" + enabled;
    }
})