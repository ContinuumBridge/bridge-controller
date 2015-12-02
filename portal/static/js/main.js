
var $ = require('jquery');
import global from 'global-object';


//var CBApp = require('index');
var Portal = global.Portal = require('index');
require('./cb/views/mixins/mixins');
require('./cb/views/components/components');
require('./cb/modules/config/config');
//require('./cb/modules/developer/developer');
//require('./cb/modules/home/home');
require('./cb/modules/market/market');
//require('./cb/modules/nav/nav');
//require('./cb/modules/notifications/notifications');
require('./cb/socket');
require('./cb/models');
//require('./cb/views');

//(function($){
$(document).ready(function() {

    Portal.start();
});
//})(jQuery);


