
var Mixins = {};

Mixins.Counter = require('./counter');
Mixins.Filter = require('./filter');
Mixins.RowView = require('./table').RowView;
Mixins.TableView = require('./table').TableView;
Mixins.Installable = require('./installable');

Portal.Mixins = Mixins;

