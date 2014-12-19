
require('./components');

Portal.Components.NumberField = Marionette.ItemView.extend({

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
                //observe: ['change', 'change:relational', 'installs_permitted'],
                modelEvents: ['change'],
                onGet: 'getDisabled'
            }],
            observe: ['installs_permitted'],
            events: ['change'],
            onGet: 'getContent'
        }
    },

    /*
    getClass: function() {

        var enabled = this.getEnabled() || "";

        return "form-control bfh-number app-form-input installs-permitted" + enabled;
    },
    */

    getDisabled: function(val) {

        console.log('numbers getDisabled');
        //testModel = this.model;
        //return this.model.unsavedAttributes() ? true : false;
        return false;
    }
});