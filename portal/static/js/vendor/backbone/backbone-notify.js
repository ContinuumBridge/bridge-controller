
//var notify = require('notify');

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof Backbone === "undefined" || Backbone === null) {
    throw new Error("Backbone is not defined. Please include the latest version from http://documentcloud.github.com/backbone/backbone.js");
  }

  if (typeof Backbone.Modal === "undefined" || Backbone.Modal === null) {
      throw new Error("Backbone Modal is not defined. Please include the latest version from http://documentcloud.github.com/awkward/backbone.modal/blob/master/backbone.modal-bundled.js");
  }

  Backbone.Notification = (function(_super) {

    __extends(Notification, _super);

    Notification.prototype.prefix = 'bbn';

    function Notification() {
      Backbone.Modal.prototype.constructor.apply(this, this.args);
    }

    return Notification;

  })(Backbone.Modal);

}).call(this);