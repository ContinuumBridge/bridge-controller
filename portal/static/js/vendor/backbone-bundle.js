

var Backbone = require('backbone')
    ,$ = require('jquery')
    ,_ = require('underscore');

Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('backbone.marionette');
Backbone.Modal = require('backbone.modal');
require('./backbone-relational');
require('../cb/misc/relational-models');
require('./backbone.io-browserify');

var Cocktail = require('./backbone-cocktail');

// Mix in Backbone Epoxy
require('./backbone-epoxy');
Cocktail.mixin(Marionette.View, Backbone.Epoxy.View);

// Mix in Backbone Sorted
var SortedMixin = require('./backbone-sorted');
_.extend(Marionette.CollectionView.prototype, SortedMixin);
_.extend(Marionette.CompositeView.prototype, SortedMixin);

module.exports = Backbone;



