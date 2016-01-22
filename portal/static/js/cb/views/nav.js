
var Backbone = require('backbone-bundle');
var React = require('react');
var Router = require('react-router');
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

module.exports.Topbar = React.createClass({

    mixins: [ Router.State ],

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

var BridgeList = React.createClass({

    mixins: [Backbone.React.Component.mixin, Router.State, Router.Navigation],

    bridgeClick: function(e) {
        //console.log('bridgeClick event target', e.target);
        var bridgeID = parseInt(e.target.getAttribute('data-tag'));
        //console.log('bridgeClick bridgeID', bridgeID);
        var bridge = Portal.bridgeCollection.getID(bridgeID);
        //console.log('bridgeClick bridge', bridge);
        Portal.setCurrentBridge(bridge);
    },

    createItem: function(bridge) {

        //console.log('createItem bridge', bridge);
        return (
            /*
            <MenuItem onClick={this.bridgeClick}>{bridge.name}</MenuItem>
             <li key="test">
             <a data-tag="bridgeID" onClick={this.bridgeClick}>Test Name</a>
             </li>
            */
            <li key={bridge.id}>
                <a data-tag={bridge.id} onClick={this.bridgeClick}>{bridge.get('name')}</a>
            </li>
        );
    },

    render: function () {

        var currentBridge = Portal.getCurrentBridge();
        //var currentBridge = Portal.bridgeCollection.get({id: 2});
        var bridgeName = currentBridge ? currentBridge.get('name') : "My Bridges";
        //this.currentBridgeID = currentBridge? currentBridge.get('id') : 0;

        var bridges = this.props.collection.map(this.createItem);
        console.log('bridgeList bridges ', bridges );
        //var bridgeCollection = this.props.collection.without(currentBridge);
        return (
            <DropdownButton bsStyle="link" className="bridge-dropdown-header btn-nav" title={bridgeName} key="bridge-dropdown" id="bridge-header">
                {bridges}
            </DropdownButton>
            /*
             {this.props.collection.map(this.createItem)}
            <li className="dropdown">
                <a href="#" id="bridge-header" className="dropdown-toggle" data-toggle="dropdown">
                    <div className="header-text">Test {bridgeName}</div><b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                    {this.props.collection.map(this.createItem)}
                </ul>
            </li>
             */
        )
    }
});

var AccountList = React.createClass({

    mixins: [Backbone.React.Component.mixin, Router.State, Router.Navigation],

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

    mixins: [ Router.State, Router.Navigation ],

    onClick: function() {

        console.log('onClick nav query', this.getQuery());
        this.transitionTo(this.props.to, {}, this.getQuery());
    },

    render: function () {
        //var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
        var isActive = false;
        var className = isActive ? 'active' : '';

        return (
            <li className={className}>
                <Router.Link {...this.props}></Router.Link>
            </li>
        );
    }
});
