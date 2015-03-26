
var Spec = Swarm.Spec;

var Mouse = require('../portals/test/models').Mouse;
var Mice = require('../portals/test/models').Mice;

function PortalApp (ssnid) {
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

PortalApp.prototype.refresh = function (path) {
    var self = this;
    self.path = path || self.path;
    if (!self.active) {
        self.installListeners();
        self.active = true;
    }
    // rerender DOM
    React.renderComponent(
        MainView({
            spec: '/GrooveEngine#grooveEngine',
            app: self
        }),
        document.getElementById('app')
    );
    // recover focus
    /*
    var item = this.getItem();
    var edit = document.getElementById(item._id);
    if (edit) {
        edit.focus();
        // safari text select fix
        edit.value = edit.value;
        // TODO scroll into view
    }
    */
    // set URI
    var route = this.router.buildRoute(this.path);
    var newLink = window.location.origin + route;
    window.history.replaceState({},"",newLink);
    /*
    if (isEmbed) {
        var link = document.getElementById("self");
        link.setAttribute('href', newLink);
        link.innerHTML = 'link';
    }
    */
};

module.exports = PortalApp;
