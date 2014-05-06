
var $ = require('jquery-browserify');

var CBApp = require('index');
require('./cb/modules/config/config');
require('./cb/socket');
require('./cb/models');
require('./cb/views');


(function($){
	$(document).ready(function() {

        CBApp.start();
	});
})(jQuery);

