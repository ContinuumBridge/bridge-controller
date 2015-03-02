
var Spec = Swarm.Spec;

var Mouse = require('./models').Mouse;
var Mice = require('./models').Mice;

function PortalApp (ssnid, listId) {
    this.path = [];
    this.active = false;
    this.ssnid = ssnid;

    //this.router = new TodoRouter();
    //this.refreshBound = this.refresh.bind(this);
    //this.initSwarm();
    //this.parseUri();
    this.isTouch = ('ontouchstart' in window)
    || (navigator.MaxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0);
}

PortalApp.prototype.initSwarm = function (stream) {
    //this.storage = null;
    this.storage = new Swarm.SharedWebStorage('webst',{persistent:true});
    //this.wsServerUri = 'ws://'+window.location.host;
    this.host = Swarm.env.localhost = new Swarm.Host(this.ssnid,'',this.storage);
    this.host.connect(stream, {delay: 50});
};

module.exports = PortalApp;
