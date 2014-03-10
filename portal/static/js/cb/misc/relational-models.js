
Backbone.HasOne = Backbone.HasOne.extend({

    findRelated: function( options ) {

        var related = null;

        options = _.defaults( { parse: this.options.parse }, options );

        if ( this.keyContents instanceof this.relatedModel ) {
                related = this.keyContents;
        }
        else if ( this.keyContents || this.keyContents === 0 ) { // since 0 can be a valid `id` as well
                
                // ADDED If the keyContents are a uri, extract the id and create an object
                var idArray = CBApp.filters.apiRegex.exec(this.keyContents);
                if (idArray && idArray[1]) {
                        this.keyContents = { id: idArray[1] };
                }

                var opts = _.defaults( { create: this.options.createModels }, options );
                related = this.relatedModel.findOrCreate( this.keyContents, opts );

                 // ADDED Add model to initializeCollection
                var initializeCollection = this.options.initializeCollection
                //console.log('related is', related);
                //console.log('initializeCollection is', initializeCollection);
                if ( _.isString( initializeCollection ) ) {
                        initializeCollection = CBApp[initializeCollection];
                }
                if (initializeCollection instanceof Backbone.Collection) {
                        initializeCollection.add(related);
                }

                // ADDED If the model only has an id, fetch the rest of it
                if (related && related.isNew()) {
                        related.fetch();
                }
        }

        // Nullify `keyId` if we have a related model; in case it was already part of the relation
        if ( related ) {
                this.keyId = null;
        }

        return related;
    }
});

Backbone.HasMany = Backbone.HasMany.extend({

    findRelated: function( options ) {

        var related = null;

        options = _.defaults( { parse: this.options.parse }, options );

        // Replace 'this.related' by 'this.keyContents' if it is a Backbone.Collection
        if ( this.keyContents instanceof Backbone.Collection ) {
                this._prepareCollection( this.keyContents );
                related = this.keyContents;
        }
        // Otherwise, 'this.keyContents' should be an array of related object ids.
        // Re-use the current 'this.related' if it is a Backbone.Collection; otherwise, create a new collection.
        else {
                var toAdd = [];

                _.each( this.keyContents, function( attributes ) {
                        if ( attributes instanceof this.relatedModel ) {
                                var model = attributes;
                        }
                        else {
                                // ADDED If the keyContents are a uri, extract the id and create an object
                                var idArray = CBApp.filters.apiRegex.exec(attributes);
                                if (idArray && idArray[1]) {
                                        this.attributes = { id: idArray[1] };
                                }

                                // If `merge` is true, update models here, instead of during update.
                                model = this.relatedModel.findOrCreate( attributes,
                                        _.extend( { merge: true }, options, { create: this.options.createModels } )
                                );

                                // ADDED Add model to initializeCollection
                                var initializeCollection = this.options.initializeCollection
                                if ( _.isString( initializeCollection ) ) {
                                        initializeCollection = CBApp[initializeCollection];
                                }
                                if (initializeCollection instanceof Backbone.Collection) {
                                        initializeCollection.add(model);
                                }

                                // ADDED If the model only has an id, fetch the rest of it
                                if (model && model.isNew()) {
                                        model.fetch();
                                }
                        }

                        model && toAdd.push( model );
                }, this );

                if ( this.related instanceof Backbone.Collection ) {
                        related = this.related;
                }
                else {
                        related = this._prepareCollection();
                }

                // By now, both `merge` and `parse` will already have been executed for models if they were specified.
                // Disable them to prevent additional calls.
                related.set( toAdd, _.defaults( { merge: false, parse: false }, options ) );
        }

        // Remove entries from `keyIds` that were already part of the relation (and are thus 'unchanged')
        this.keyIds = _.difference( this.keyIds, _.pluck( related.models, 'id' ) );

        return related;
    }
});

/*
CBApp.RelationalModel = Backbone.RelationalModel.extend({

    idAttribute: 'id',

    initializeRelated: function(resp, options) {
        
        console.log('Resp is', resp);
        var relationsArray = this.getRelations();
        
        for (var i = 0; i < relationsArray.length; i++) {
            
            var rel = relationsArray[i];
            var initializeCollection = rel.options.initializeCollection

            if ( _.isString( initializeCollection ) ) {
                initializeCollection = CBApp[initializeCollection];
            }
            
            

        }
    },

    parse: function(resp, options) {

        this.initializeRelated(resp, options);
        return resp;
    },
}); 
*/
