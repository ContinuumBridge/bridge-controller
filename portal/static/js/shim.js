
module.exports = {
    "jquery": "$",
    "underscore": "_",
    "backbone": {
        "exports": "Backbone",
        "depends": {
            "jquery":"$",
            "underscore":"underscore"
        }
    },
    "backbone.babysitter": {
        "exports": "Backbone.BabySitter",
        "depends": {
            "backbone":"Backbone"
        }
    },
    "backbone.wreqr": {
        "exports": "Backbone.Wreqr",
        "depends": {
            "backbone":"Backbone",
            "underscore":"_"
        }
    },
    "backbone.marionette": {
        "exports": "Marionette",
        "depends": {
            "backbone":"Backbone",
            "backbone.wreqr":"Backbone.Wreqr",
            "backbone.babysitter":"Backbone.BabySitter",
            "underscore":"_"
        }
    },
    "backbone.modal": {
        "exports": "Backbone.Modal",
        "depends": {
            "backbone":"Backbone",
            "backbone.marionette": "Marionette",
            "underscore":"_"
        }
    },
    "bootstrap": {
        "exports": "bootstrap",
        "depends": {
            "jquery":"$"
        }
    }
};