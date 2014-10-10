
var $ = require('jquery-browserify');
var caja = require('caja');

var CBApp = require('index');
require('./cb/modules/config/config');
require('./cb/modules/dashboard/dashboard');
require('./cb/modules/developer/developer');
require('./cb/modules/store/store');
require('./cb/modules/nav/nav');
require('./cb/modules/notifications/notifications');
require('./cb/socket');
require('./cb/models');
require('./cb/portals/portals');
//require('./cb/views');

(function($){
	$(document).ready(function() {

        CBApp.start();
	});
})(jQuery);

