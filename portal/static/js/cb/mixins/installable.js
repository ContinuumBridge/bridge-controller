
Portal.InstallableModelMixin = {

    relations: [
        {
            type: Backbone.HasOne,
            key: 'notification',
            relatedModel: 'Portal.ModelStatus',
            createModels: true,
            includeInJSON: false,
            initializeCollection: 'notificationCollection',
            reverseRelation: {
                type: Backbone.HasOne,
                key: 'model',
                includeInJSON: false
            }
        }
    ],

    initialize: function(undefined, options) {

        this.on('change:status', this.onStatusChange, this);
    },

    onStatusChange: function(model, value, options) {
        if(_.contains(['error', 'install_error', 'uninstall_error'], value)) {
            var notification = this.get('notification');
            if (!notification) {
                Portal.notificationCollection.add(
                    new Portal.ModelStatus({model: this, type: 'installStatus'})
                )
            }
            //var notification = Portal.notificationCollection.findOrAdd({model: this, type: 'installStatus'});
        }
        console.log('status changed', model, value, options);
    }
}