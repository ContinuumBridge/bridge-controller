
var CBApp = require('index');
require('./cb/views/mixins/mixins');
require('./cb/views/components/components');
require('./cb/modules/config/config');
//require('./cb/views/dashboard');
require('./cb/modules/developer/developer');
require('./cb/modules/home/home');
require('./cb/modules/market/market');
require('./cb/modules/nav/nav');
//require('./cb/modules/notifications/notifications');
require('./cb/socket');
require('./cb/models');
//require('./cb/views');

(function($){
	$(document).ready(function() {

        Portal.start();
	});
})(jQuery);


