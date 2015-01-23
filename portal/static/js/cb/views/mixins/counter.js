
module.exports = {

    incrementField: function(model, fieldName, increment) {

        if (!model.isSyncing()) {

            var currentValue = model.get(fieldName);

            console.log('incrementField currentValue', currentValue);
            console.log('incrementField increment', increment);
            if (!currentValue) currentValue = 0;

            var nextValue = parseInt(currentValue) + parseInt(increment);
            if (nextValue < 0) nextValue = 0;
            model.set(fieldName, nextValue);

            console.log('incrementField nextValue', nextValue);
            console.log('incrementField model.isNew()', model.isNew());

            if (nextValue > 0) {
                console.log('incrementField create');
                if (model.isNew()) {
                    Portal.dispatch({
                        source: 'portal',
                        actionType: 'create',
                        itemType: model.__proto__.constructor.modelType,
                        payload: model
                    });
                } else {
                    console.log('incrementField save');
                    model.save();
                }
            } else {
                if (!model.isNew()) {
                    console.log('incrementField destroyOnServer');
                    model.destroyOnServer();
                }
            }
        }
    }
}