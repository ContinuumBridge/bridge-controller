
var Backbone = require('backbone-bundle');
var React = require('react');
var Router = require('react-router');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

module.exports.Topbar = React.createClass({

    //mixins: [ Router.History ],

    render: function() {

        return (
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle pull-right" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="home navbar-brand"><strong>ContinuumBridge</strong></a>
                    </div>

                    <div className="collapse navbar-collapse navbar-ex1-collapse" role="navigation">
                        <ul id="navbar-left" className="nav navbar-nav navbar-left">
                            <BridgeList collection={Portal.bridgeCollection} />
                        </ul>
                        <div id="navbar-right" className="nav navbar-nav navbar-right">
                            <Tab to="dashboard">Dashboard</Tab>
                            <Tab to="market">App Market</Tab>
                            <Tab to="config">Config</Tab>
                            <AccountList />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var connectionColours = {
    true: 'led-green',
    false: 'led-red'
}

var BridgeList = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    bridgeClick: function(e) {

        var bridgeID = parseInt(e.target.getAttribute('data-tag'));
        var bridge = Portal.bridgeCollection.getID(bridgeID);
        Portal.setCurrentBridge(bridge, true);
    },

    getLEDType: function(connected, error) {

        if (connected) {
            if (connected == 'true') {
                return error ? 'led-amber' : 'led-green';
            } else if (connected == 'false') {
                return 'led-red';
            }
        } else {
            return 'led-off';
        }
    },

    createItem: function(bridge) {

        /*
        var error = bridge.status != 'operational';
        var imgPath = "/static/img/leds/" + this.getLEDType(bridge.connected, error) + ".png";
        var led = <img className="led" src={imgPath}/>;
        */
        /*
        var ledClass = connected ? connectionColours[connected] : "led-off";
        led = <div className="led-box">
                <div className={ledClass}></div>
              </div>;
        */
        return (
            <li key={bridge.id}>
                <a data-tag={bridge.id} onClick={this.bridgeClick}>{bridge.get('name')}</a>
            </li>
        );
    },

    render: function () {

        var currentBridge = Portal.getCurrentBridge(false);
        //var currentBridge = Portal.bridgeCollection.get({id: 2});
        var bridgeName = currentBridge ? currentBridge.get('name') : "My Bridges";
        //this.currentBridgeID = currentBridge? currentBridge.get('id') : 0;

        var bridges = this.props.collection.map(this.createItem);
        //var bridgeCollection = this.props.collection.without(currentBridge);
        return (
            <DropdownButton bsStyle="link" className="bridge-dropdown-header btn-nav" title={bridgeName} key="bridge-dropdown" id="bridge-header">
                {bridges}
            </DropdownButton>
        )
    }
});

var AccountList = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    createItem: function(bridge) {

        return (
            <li key={bridge.id}>
                <a data-tag={bridge.id} onClick={this.bridgeClick}>{bridge.name}</a>
            </li>
        );
    },

    render: function () {

        var firstName = Portal.currentUser.get('first_name');
        var lastName = Portal.currentUser.get('last_name');
        var fullName = firstName + " " + lastName;

        return (
            <DropdownButton bsStyle="link" className="bridge-dropdown-header" title={fullName} key="account-dropdown" id="account-header">
                <Tab to="account">My Account</Tab>
                <Tab to="developer">Developer</Tab>
                <li name="logout">
                    <a href="/accounts/logout/">Logout</a>
                </li>
            </DropdownButton>
            /*
            <li id="account-dropdown" className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <div className="header-text">{firstName} {lastName}</div>
                    <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                    <Tab to="account">My Account</Tab>
                    <Tab to="developer">Developer</Tab>
                    <li name="logout">
                        <a href="/accounts/logout/">Logout</a>
                    </li>
                </ul>
            </li>
            */
        )
    }
})

var Tab = React.createClass({

    contextTypes: {
        history: React.PropTypes.object
    },

    render: function () {

        //var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
        var isActive = this.context.history.isActive(this.props.to);
        var className = isActive ? 'active' : '';

        return (
            <li className={className}>
                <Router.Link {...this.props}></Router.Link>
            </li>
        );
    }
});
