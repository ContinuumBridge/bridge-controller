
//logger = "Ten";

//test2 = require('./test2');

var test = function(config) {

    //this.apples = apples;
    this.config = config;
    //this.countApples();
}

var t = new test({ test:"Test config 1" });

var u = new test(t.config);

u.config.test = "Test config u";

console.log('u config', u.config);

console.log('t config', t.config);
/*
test.prototype.countApples = function() {

    console.log(this.apples, 'apples');
}

var tester = function(apples) {
    this.apples = apples;
}

tester.prototype = new test();

t = new tester();
 */
