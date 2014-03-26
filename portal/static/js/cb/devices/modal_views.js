
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.InstallDeviceModal = Backbone.Modal.extend({

    template: _.template($('#modal-template').html()),
    cancelEl: '#cancel-button',
    submitEl: '#submit-button',

    submit: function() {
        console.log('Submitted modal', this);
        var friendlyName = this.$('#friendly-name').val();
        this.model.installDevice(friendlyName);
    }
});

