
var util = require('util');

var Errors = {};

Errors.DjangoError = function(response) {
    this.name = "DjangoError";

    var res = response || {};
    var req = res.req || {};
    var httpVersion = util.format('HTTP/%s.%s', res.httpVersionMajor, res.httpVersionMinor);
    var message = util.format('"%s %s %s" %s', req.method, req.path, httpVersion, res.statusCode);

    this.message = (message || "");
    this.response = (res.rawEncoded || "");
}
Errors.DjangoError.prototype = Error.prototype;

Errors.Unauthorized = function(message) {
    this.name = "Unauthorized";
    this.message = (message || "");
}
Errors.Unauthorized.prototype = Error.prototype;

module.exports = Errors;

