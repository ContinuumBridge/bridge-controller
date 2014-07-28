
try {
   var autobahn = require('autobahn');
} catch (e) {
   // when running in browser, AutobahnJS will
   // be included without a module system
}

console.log('start');
var connection = new autobahn.Connection({
   url: 'ws://lolhosfdsat:8080/ws',
   realm: 'realm1'}
);

connection.onopen = function (session) {

   var counter = 0;

   console.log('on open');
   setInterval(function () {
      console.log("publishing to topic 'com.myapp.topic1': " + counter);
      session.publish('com.myapp.topic1', [counter]);
      counter += 1;
   }, 1000);
};

connection.open();
console.log('finish');
