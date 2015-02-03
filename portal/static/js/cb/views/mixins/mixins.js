
var Mixins = {};

Mixins.Counter = require('./counter');
Mixins.Filter = require('./filter');

Portal.Mixins = Mixins;

Portal.RowView = require('./table').RowView;
Portal.TableView = require('./table').TableView;
