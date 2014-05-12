
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


Backbone.Collection = Backbone.Collection.extend({

   findUnique: function(attrs) {

       // Returns a model after verifying the uniqueness of the attributes
       models = this.where(attrs);
       if(models.length > 1) { console.warn(attrs, 'is not unique') }
       return models[0] || void 0;
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
Backbone.RelationalModel.prototype.updateRelations = function( changedAttrs, options ) {
    if ( this._isInitialized && !this.isLocked() ) {
        _.each( this._relations, function( rel ) {
            if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                // Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
                var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
                    attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

                // Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
                // Which can also happen before the originally intended related model has been found (`val` is null).
                if ( rel.related !== value || ( value === null && attr === null ) ) {
                    this.trigger( 'relational:change:' + rel.key, this, value, options || {} );
                }
            }

            // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
            if ( rel.keySource !== rel.key ) {
                delete this.attributes[ rel.keySource ];
            }
        }, this );
    }
}
 */


Backbone.RelationalModel = Backbone.RelationalModel.extend({

    /**
     * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
     * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
     */
    initializeRelations: function( options ) {
        console.log('initializeRelations was called');
        this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
        this._relations = {};

        // Pass silent: true to suppress change events on initialisation
        options.silent = true;
        _.each( this.relations || [], function( rel ) {
            Backbone.Relational.store.initializeRelation( this, rel, options );
        }, this );

        this._isInitialized = true;
        this.release();
        this.processQueue();
    },

    updateRelations: function( changedAttrs, options ) {
        if ( this._isInitialized && !this.isLocked() ) {
            _.each( this._relations, function( rel ) {
                if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                    // Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
                    var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
                        attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

                    // Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
                    // Which can also happen before the originally intended related model has been found (`val` is null).
                    if ( rel.related !== value || ( value === null && attr === null ) ) {
                        this.trigger( 'relational:change:' + rel.key, this, value, options || {} );

                        if (CBApp._isInitialized) {
                            console.log('rel is', rel, 'value is', value);

                            console.log('rel.reverseRelation.key', rel.reverseRelation.key);
                            //var relationToModel = rel.related.get(rel.reverseRelation.key);
                            //console.log('relationToModel ', relationToModel );

                            // Get models from the relation of the this model
                            var models = rel.related instanceof Backbone.Collection ? rel.related.models : [ rel.related ];

                            var model;

                            console.log('Models are ', models);
                            for (i = 0; i < models.length; i++) {
                                // Iterate through models related to this model
                                model = models[i];

                                console.log('Model is', model);
                                // Get the relation these related models have to this model
                                var reverseRelation = model.get(rel.reverseRelation.key)
                                console.log('reverseRelation', reverseRelation);
                                if (reverseRelation) {

                                    // Get models from the relation
                                    var reverseModels = reverseRelation && reverseRelation instanceof Backbone.Collection
                                        ? reverseRelation.models : [ reverseRelation ];
                                    console.log('reverseModels', reverseModels);

                                    var setModel = function(models, modelToSet) {

                                        // Sets a model in what
                                    }
                                    if (reverseModels && reverseModels[0]) {

                                        var reverseModelsLength = reverseModels.length
                                            ? reverseModels.length : 1;
                                        console.log('reverseModelsLength', reverseModelsLength);
                                        for (i = 0; i < reverseModelsLength; i++) {
                                            reverseModel = reverseModels[i];
                                            console.log('reverseModel', reverseModel);
                                            console.log('this._isInitialized', this._isInitialized);
                                            console.log('this.id', this.id);
                                            //console.log('reverseModel.id', reverseModel.id);
                                            if (reverseModel && (reverseModel.id == this.id)) {
                                                console.log('hello!');
                                                //reverseModel.set(this.toJSON());
                                                break;
                                            } else if (i  == (reverseModelsLength - 1)) {
                                                try {
                                                    console.log('reverseRelation.models', reverseRelation);
                                                    reverseRelation.add(this.toJSON());
                                                    console.log('reverseRelation after adding', reverseRelation);
                                                    break;
                                                } catch (e) {
                                                    if (e instanceof TypeError) {
                                                        console.error('typeerror', e);
                                                        //reverseRelation.set(this.toJSON());
                                                    } else {
                                                        console.error(e);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            /*
                            // ADDED If the value is a uri, extract the id
                            var idArray = CBApp.filters.apiRegex.exec(value);
                            var id = (idArray && idArray[1]) ? idArray[1] : void 0;

                            if (id) {

                                console.log('id is', id)
                                var reverseRelation = rel.getReverseRelations(rel.related);
                                console.log('Reverse relation is', reverseRelation);
                                var model = rel.related.get(id);
                            }
                            // ADDED automatically update related models
                            if (value.id) {

                                console.log('model is', model);
                            }
                            _.each(value, function (data) {
                                //console.log('data is', data);
                                /*
                                var model = rel.related.get(data.id);
                                if (model) {
                                    model.set(data);
                                } else {
                                    rel.related.add(data);
                                }
                            });
                        */
                        }
                    }
                }

                // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
                if ( rel.keySource !== rel.key ) {
                    delete this.attributes[ rel.keySource ];
                }
            }, this );
        }
    }

    /*
    updateRelations: function(changedAttrs, options) {
        if ( this._isInitialized && !this.isLocked() ) {
            _.each( this._relations || [], function( rel ) {
                if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                    // Update from data in `rel.keySource` if set, or `rel.key` otherwise
                    var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ]
                        ,attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

                    if ( rel.related !== value || ( value === null && attr === null )) {
                        this.trigger( 'relational:change:' + rel.key, this, value, options || {} );

                        /*
                        // ADDED automatically update related models
                        _.each(val, function (data) {
                            console.log('data is', data);
                            var model = rel.related.get(data.id);
                            if (model) {
                                model.set(data);
                            } else {
                                rel.related.add(data);
                            }
                        });
                        */
                        /*
                    }
                }

                // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
                if ( rel.keySource !== rel.key ) {
                    delete this.attributes[ rel.keySource ];
                }
            }, this );
        }
    }
    */
});