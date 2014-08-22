
//logger = "Ten";

//test2 = require('./test2');

var Test = function(config) {

    //this.apples = apples;
    this.config = config;
    //this.countApples();
}

Test.prototype.change = function() {

    console.log('config is', this.config);
}

var Test2 = function(config) {

    this.config = config;
}
Test2.prototype = new Test();

var t = new Test({ test:"Test config T" });

var u = new Test2({ test:"Config U" });

t.change();
u.change();
/*
u.config.test = "Test config u";

console.log('u config', u.config);

console.log('t config', t.config);
test.prototype.countApples = function() {

    console.log(this.apples, 'apples');
}

var tester = function(apples) {
    this.apples = apples;
}

tester.prototype = new test();

t = new tester();
 */
