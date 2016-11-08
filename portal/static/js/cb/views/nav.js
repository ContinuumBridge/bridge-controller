
var Backbone = require('backbone-bundle');
var React = require('react');
var Router = require('react-router');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Nav = require('react-bootstrap').Nav;
var Navbar = require('react-bootstrap').Navbar;
var NavDropdown = require('react-bootstrap').NavDropdown;
var NavItem = require('react-bootstrap').NavItem;

module.exports.Topbar = React.createClass({

    //mixins: [ Router.History ],

    render: function() {

        return (
                <Navbar inverse collapseOnSelect fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/"><img src="/static/img/cb-logo-inverse.png" className="nav-cb-logo"/></a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <BridgeList collection={Portal.bridgeCollection} />
                        </Nav>
                        <Nav pullRight>
                            <Tab to="dashboard">Dashboard</Tab>
                            <Tab to="market">App Market</Tab>
                            <Tab to="config">Config</Tab>
                            <AccountList />
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
            /*
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
            <NavItem eventKey={1} href="#">Link Right</NavItem>
                            <NavItem eventKey={2} href="#">Link Right</NavItem>
                            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1}>Action</MenuItem>
                                <MenuItem eventKey={3.2}>Another action</MenuItem>
                                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                            </NavDropdown>
            */
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
            <li name={bridge.get('name')} key={bridge.id}>
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
        //<div className="dropdown btn-group btn-group-link nav-bridge-dropdown">
        return (
            <DropdownButton bsStyle="link" className="nav-bridge-dropdown" title={bridgeName} key="bridge-dropdown" id="nav-bridge-dropdown">
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
            <DropdownButton bsStyle="link" className="account-dropdown-list" title={fullName} key="account-dropdown" id="account-dropdown-list">
                <Tab to="account">My Account</Tab>
                <Tab to="developer">Developer</Tab>
                <li name="logout">
                    <a href="/accounts/logout/">Logout</a>
                </li>
            </DropdownButton>
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
