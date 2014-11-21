
var Backbone = require('backbone')
    ,$ = require('jquery')
    ,_ = require('underscore')
    ,Cocktail = require('backbone-cocktail');

Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('./backbone.stickit');
require('backbone.io');
require('./backbone.trackit');
require('backbone.marionette');
require('backbone.marionette.subrouter');
//require('./backbone-bossview');
require('backbone.modal');


//require('./backbone-notify');

require('./backbone-relational');
require('../../cb/misc/relational-models');

var CBModelMixin = require('./backbone-cb-model-mixin');
Cocktail.mixin(Backbone.RelationalModel, CBModelMixin);

var CBCollectionMixin = require('./backbone-cb-collection-mixin');
Cocktail.mixin(Backbone.Collection, CBCollectionMixin);

var CBViewsMixin = require('./backbone-cb-views');
Cocktail.mixin(Marionette.ItemView, CBViewsMixin.ItemView);
Cocktail.mixin(Marionette.CollectionView, CBViewsMixin.RelationalCollectionView);
// Required for backbone deferred
Q = require('q');

require('./backbone-cb-model');

var originalCollection = Backbone.Collection;

require('backbone-deferred');

Backbone.Collection = Backbone.Deferred.Collection;

QueryEngine = require('query-engine');

//Backbone.Deferred.Collection = QueryEngine.QueryCollection;

Backbone.Collection = originalCollection;

//Backbone.QueryCollection = QueryEngine.QueryCollection;

require('backbone-react-component');

/*
var TrackableModelMixin = require('./backbone-trackable');
Cocktail.mixin(Backbone.Deferred.Model, TrackableModelMixin);
*/

/*
// Mix in Backbone Sorted
var SortedMixin = require('./backbone-sorted');
_.extend(Marionette.CollectionView.prototype, SortedMixin);
_.extend(Marionette.CompositeView.prototype, SortedMixin);
*/

module.exports = Backbone;



