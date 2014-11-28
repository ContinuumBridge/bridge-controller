
Portal.StaffAppView = Marionette.ItemView.extend({

    tagName: 'table',
    template: require('./templates/staffApp.html'),

    bindings: {
        '.app-id': {
            observe: [],
            onGet: function() {
                return "App ID: " + this.model.get('id');
            }
        }
    },

    licenceBindings: {
        '.licence-id': {
            observe: [],
            onGet: function() {
                //return this.model.get('licence').get('id');
                return "Licence ID: " + this.licence.get('id');
            }
        }
    },

    onRender: function() {
        if (this.model) {
            this.stickit();
        }
        if (this.licence) {
            this.stickit(this.licence, this.licenceBindings);
        }
    }
});
