

var Backbone = require('backbone')
    ,$ = require('jquery')
    ,_ = require('underscore');

Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('backbone.marionette');
require('./backbone-relational');
require('../cb/misc/relational-models');
require('./backbone.io-browserify');
require('./backbone.modal-bundled');

module.exports = Backbone;

