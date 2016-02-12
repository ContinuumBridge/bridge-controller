
var $ = require('jquery');
import global from 'global-object';

var Portal = global.Portal = require('index');

require('./cb/views/mixins/mixins');
require('./cb/views/components/components');
//require('./cb/modules/config/config');
//require('./cb/modules/market/market');
require('./cb/socket');
require('./cb/models');

$(document).ready(function() {

    Portal.start();
});


