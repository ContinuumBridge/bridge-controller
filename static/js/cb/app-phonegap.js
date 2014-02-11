

(function($){

	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	injectSigninHeader = function() {
		authWindow.executeScript({
			code: "if (typeof window.createCookie == 'function') {createCookie('is_phonegap', true, 1);}"
			//code: "if (typeof window.createCookie == 'function') {alert('Here is an alert');}"
			//code: "alert('Here is an alert');"
		});
	}
	
	// Global sign in window reference
	var authWindow = null;

	authProcess = function() {

		//window.localStorage.removeItem("csrftoken");
		//window.localStorage.removeItem("sessionid");
		
		authWindow = window.open('http://54.200.16.244:8000/accounts/login/', '_blank', 'location=yes');
	
		authWindow.addEventListener('loadstop', window.injectSigninHeader);
		//authWindow.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
		
		//$(authWindow).on('loadstart', function(event) {
		authWindow.addEventListener('loadstart', function(event) {
			  var url = event.url;
			  var csrfToken = /\?csrftoken=(.+)&/.exec(url);
			  var sessionID = /\&sessionid=(.+)$/.exec(url);
			  var error = /\?error=(.+)$/.exec(url);
			
			  if (sessionID || error) {
			  	//alert('Here is the sessionid: '+sessionID[1]);
			  	window.localStorage.setItem("csrftoken", csrfToken[1]);
			  	$.cookie('test_cookie', 'test_value', { expires: 7, path: '/', domain: 'www.vennyou.co.uk' });
			  	createCookie('X-CSRFToken',csrfToken[1],10);
			  	window.localStorage.setItem("sessionid", sessionID[1]);
			  	createCookie('sessionid',sessionID[1],10);
				authWindow.close();
			  }
			
		});
		
	}

	/*var redirectToLogin = function () {
		var locationhref = "/login";
		if (location.hash && location.hash.length > 0) {
			locationhref += "?hash=" + location.hash.substring(1);
		}
		location.href = locationhref;
	};
	
	function alertDismissed() {
	  console.log("Alert dismissed!");
	}*/

	function appShowAlert() {
		  alert(
			'How are you?'
		  );
	}
	
	function onDeviceReady() {
		
		//window.eventsList.fetch({ reset: true });
		
		jQuery(function() {
			
			authProcess();
		});
		//window.appShowAlert();
		//navigator.geolocation.watchPosition(geolocationDataReceived, geolocationError, { enableHighAccuracy: true });
		//resultsElem = document.querySelector('#geolocation-results');

	}
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
})(jQuery);