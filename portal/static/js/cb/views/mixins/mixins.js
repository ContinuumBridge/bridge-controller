
var Mixins = {};

Mixins.Counter = require('./counter');
Mixins.Filter = require('./filter');
Mixins.RowView = require('./table').RowView;
Mixins.TableView = require('./table').TableView;
Mixins.InstallableList = require('./installable');

Portal.Mixins = Mixins;

