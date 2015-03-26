
Portal.ConnectorMixin = {

    toggleExistenceOnServer: function(model) {

        if (!model.isSyncing()) {
            if (model.isNew()) {
                console.log('toggleExistenceOnServer save');
                //model.save();
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: model.__proto__.constructor.modelType,
                    payload: model
                });
            } else {
                console.log('toggleExistenceOnServer destroyOnServer');
                model.destroyOnServer();
            }
        }
    }
}