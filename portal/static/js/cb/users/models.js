
//CBApp.User = Backbone.Deferred.Model.extend({
CBApp.User = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    subModelTypes: {
		'currentUser': 'CBApp.CurrentUser',
	},

    /*
    defaults: {
        type: 'user'
    },
    */

    initialize: function() {

        //this.bindBackend();
        //var bridgeControlArray = this.get('bridgeControls');

        // Set the current bridge
        //var currentBridge = bridgeControlArray.at(0).get('bridge');
        //currentBridge.set('current', true);

    },

    getCBID: function() {

        return "UID" + this.get('id');
    }
}, { modelType: "user" });

CBApp.UserCollection = Backbone.Collection.extend({

    model: CBApp.User,
    backend: 'user',

    initialize: function() {
        //this.bindBackend();
    },

    parse : function(response){
        return response.objects;
    }
});
