
//import global from 'global-object';

var $ = require('jquery')
    ,_ = require('underscore')
    ,Cocktail = require('backbone-cocktail');

Backbone = require('backbone');
//global.Backbone = Backbone;
//export var Backbone = require('backbone');
Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('./backbone-cb-model-pre');

require('./backbone.stickit');
//require('cb-backbone.io');
require('./backbone.io');
require('./backbone.trackit');
require('backbone.marionette');
//require('backbone.marionette.subrouter');
//require('./backbone-bossview');
require('backbone.modal');


//require('./backbone-notify');

//require('expose?window.Backbone=>Backbone!./backbone-relational');
//console.log('backbone-bundle global', Object.keys(global));
//require('./backbone-relational');
require('imports?this=>window!exports?Backbone!./backbone-relational');
console.log('backbone-bundle Backbone', Object.keys(Backbone));
//require('./backbone-relational');
//require('./backbone-relational');
require('./backbone-cb-relational-models');
//require('imports?this=>window!exports?Backbone!./backbone-cb-relational-models');

var CBModelMixin = require('./backbone-cb-model-mixin');
Cocktail.mixin(Backbone.RelationalModel, CBModelMixin);

//var CBCollectionMixin = require('./backbone-cb-collection-mixin');
//Cocktail.mixin(Backbone.Collection, CBCollectionMixin);

//var CBViewsMixin = require('./backbone-cb-views');
//Cocktail.mixin(Marionette.ItemView, CBViewsMixin.ItemView);
//Cocktail.mixin(Marionette.CollectionView, CBViewsMixin.RelationalCollectionView);

// Required for backbone deferred
Q = require('q');
//import Q from 'q';

require('./backbone-deferred-q');

require('./backbone-cb-model-post');

Backbone.Collection = Backbone.Deferred.Collection;

require('./backbone-cb-collection');

Backbone.QueryEngine = require('./query-engine/query-engine-bundle.js');

//var CBCollectionMixin = require('./backbone-cb-collection-mixin');
//Cocktail.mixin(QueryEngine.QueryCollection, CBCollectionMixin);

//Backbone.Deferred.Collection = QueryEngine.QueryCollection;

//Backbone.QueryCollection = QueryEngine.QueryCollection;

require('backbone-react-component-cb');
//require('./backbone-react-component');
//require('imports?root=>{}!backbone-react-component');

/*
require('imports?Backbone=backbone!backbone-react-component');
*/

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



