
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
    "backbone.marionette.subrouter": {
        "exports": "Marionette.SubRouter",
        "depends": {
            "backbone":"Backbone",
            "backbone.marionette":"Marionette",
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
    "backbone-bossview": {
        "exports": "Backbone.Marionette.BossView",
        "depends": {
            "backbone":"Backbone",
            "backbone.marionette": "Marionette",
            "underscore":"_"
        }
    },
    "backbone-deferred": {
        "exports": "Backbone",
        "depends": {
            "backbone":"Backbone",
            "q": "Q"
        }
    },
    "backbone-io": {
        "exports": "Backbone",
        "depends": {
            "backbone":"Backbone",
            "socket.io-client": "io",
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
