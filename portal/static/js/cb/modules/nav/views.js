
var React = require('react');
var Q = require('q');

require('../../views/generic-views');
require('../../views/regions');

require('../../apps/installs/views');
require('../../apps/licences/views');
require('../../bridges/views');
require('../../devices/discovery/views');
require('../../devices/installs/views');
require('../../messages/views');

var BridgeItemView = module.exports.BridgeItemView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    render: function() {

        return (
            <li>
                <a href="#">Bridge Name</a>
            </li>
        )
    }
}

var BridgeDropdownView = module.exports.BridgeDropdownView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    render: function() {

        return (
            <li className="dropdown">
                <a href="#" id="bridge-header" className="dropdown-toggle" data-toggle="dropdown"><div class="header-text">Bridges </div><b class="caret"></b></a>
                <ul id="bridge-list" className="dropdown-menu">

                </ul>
            </li>
        )
    }
}

module.exports.TopbarView = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    /*
     componentWillReceiveParams: function(params) {

     if (this.action != params.action) {
     if (params.action == 'discover-devices') {
     this.discoverDevices();
     }
     this.action = params.action;
     }
     },
     */
    navigate: function() {

    },

    render: function() {

        return (
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle pull-right" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="home navbar-brand"><strong>Continuum Bridge</strong></a>
                </div>

                <div className="collapse navbar-collapse navbar-ex1-collapse" role="navigation">
                    <ul id="navbar-left" className="nav navbar-nav navbar-left">
                        <li id="bridge-dropdown" className="dropdown"></li>
                    </ul>
                    <React.Nav>
                        <NavItemLink to="dashboard">
                            Dashboard
                        </NavItemLink>
                        <NavItemLink to="store">
                            Store
                        </NavItemLink>
                        <NavItemLink to="config">
                            Config
                        </NavItemLink>
                        <li id="account-dropdown" className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                            <div className="header-text">My Account</div>
                                <b className="caret"></b>
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="developer">Developer</a></li>
                                <li name="logout"><a href="/accounts/logout">Logout</a></li>
                            </ul>
                        </li>
                    </React.Nav>

                </div>
            </div>
        )
    }
});

/*
 <React.Navbar brand="Bounce">
 <React.Nav>
 <NavItemLink to="groove">
 Groove
 </NavItemLink>
 <NavItemLink to="harmony">
 Harmony
 </NavItemLink>
 </React.Nav>
 </React.Navbar>
 */

var InstallDeviceModal = React.createClass({

    mixins: [ Router.State ],

    getInitialState: function() {
        return {
            friendlyName: ""
        }
    },

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    installDevice: function() {
        var model = this.props.model;
        console.log('Submitted installDevice modal, props', this.props);
        this.props.installDevice(model, this.state.friendlyName);
        //var discoveredDevice = this.getModel();
        //discoveredDevice.install(this.state.friendlyName);
        //Portal.router.setParams({});
    },

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var friendlyName = this.state.friendlyName;
        //var device = this.getModel().get('device');
        var device = this.props.model.get('device');
        var title = device ? "Install " + device.get('name') : "Unknown device";


        return (
            <React.Modal show={true} onHide={function(){}}
                container={this.props.container} animation={false}>
                <React.Modal.Header closeButton>
                    <React.Modal.Title>{title}</React.Modal.Title>
                </React.Modal.Header>
                <React.Modal.Body>
                    <div>Type a name to help you remember this device ie. Kitchen Thermometer</div>
                    <br/>
                    <input type="text" value={friendlyName} onChange={this.handleFriendlyName} />
                </React.Modal.Body>
                <React.Modal.Footer>
                    <React.Button onClick={this.cancelInstall}>Close</React.Button>
                    <React.Button onClick={this.installDevice}>Install</React.Button>
                </React.Modal.Footer>
            </ React.Modal>
        )
    }
});

var InstallAppModal = React.createClass({

    mixins: [ Router.State, Router.Navigation, Backbone.React.Component.mixin],

    handleFriendlyName: function(event) {
        this.setState({friendlyName: event.target.value});
    },

    showAppMarket: function() {

        this.transitionTo('market', {}, this.getQuery());
    },

    cancelInstall: function() {

        Portal.router.setParams({});
    },

    render: function() {

        var self = this;

        var licenceCollection = Portal.currentUser.get('appLicences');
        var bridge = Portal.getCurrentBridge();

        console.log('render InstallAppModal');

        return (
            <React.Modal show={true} onHide={function(){}}
                container={this.props.container} animation={false}>
                <React.Modal.Header>
                    <React.Modal.Title></React.Modal.Title>
                </React.Modal.Header>
                <React.Modal.Body>
                    <Portal.AppLicenceTableView collection={licenceCollection} bridge={bridge} />
                </React.Modal.Body>
                <React.Modal.Footer>
                    <React.Button onClick={this.cancelInstall}>Close</React.Button>
                    <React.Button onClick={this.showAppMarket}>App Market</React.Button>
                </React.Modal.Footer>
            </ React.Modal>
        )
    }
});

/*

 <React.Modal className="portal-modal" title={title} container={this.props.container}
 onRequestHide={this.cancelInstall} show={true} onHide={function(){}} animation={false}>
 */