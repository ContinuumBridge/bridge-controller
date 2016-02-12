
var _ = require('underscore');

// For through models which the UI relies upon being there with isGhost=true
// ie. AppDevicePermissions, AppInstalls etc.

Portal.ConnectorModelMixin = {

    // A connector should be set to 'isGhost' rather than deleted by the server
    isConnector: true,

    reset: function() {

        var self = this;

        _.each(['id', 'cbid', 'status', 'status_message', 'resource_uri', 'modified', 'created'], function(field) {

            self.unset(field);
        });

        this.set({
            isGhost: true
        });

    }
}
