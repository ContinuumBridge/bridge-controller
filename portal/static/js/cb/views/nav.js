
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
                            <li id="account-dropdown" className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                <div className="header-text">My Account</div>
                                    <b className="caret"></b>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="developer">Developer</a></li>
                                    <li name="logout"><a href="/accounts/logout/">Logout</a></li>
                                </ul>
                            </li>
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
        console.log('bridgeClick event target', e.target);
        var bridgeID = parseInt(e.target.getAttribute('data-tag'));
        console.log('bridgeClick bridgeID', bridgeID);
        var bridge = Portal.bridgeCollection.getID(bridgeID);
        console.log('bridgeClick bridge', bridge);
        Portal.setCurrentBridge(bridge);
    },

    createItem: function(bridge) {

        //console.log('createItem bridge is', bridge);
        return (
            <li key={bridge.id}>
                <a data-tag={bridge.id} onClick={this.bridgeClick}>{bridge.name}</a>
            </li>
        );
        /*
        if (bridge.id != this.currentBridgeID) {
        } else {
            return;
        }
        */
        //return <li><Router.Link query={{bridge: bridge.cbid}}>{bridge.name}</Router.Link></li>;
    },

    render: function () {

        var currentBridge = Portal.getCurrentBridge();
        var bridgeName = currentBridge.get('name');
        this.currentBridgeID = currentBridge.get('id');
        //console.log('nav bridgeCollection ', this.props.collection);
        //var bridgeCollection = this.props.collection.without(currentBridge);
        return (
            <li className="dropdown">
                <a href="#" id="bridge-header" className="dropdown-toggle" data-toggle="dropdown">
                    <div className="header-text">{bridgeName}</div><b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                    {this.props.collection.map(this.createItem)}
                </ul>
            </li>
        )
    }
});

var Tab = React.createClass({

    mixins: [ Router.State, Router.Navigation ],

    onClick: function() {

        console.log('onClick nav query', this.getQuery());
        this.transitionTo(this.props.to, {}, this.getQuery());
    },

    render: function () {
        var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
        var className = isActive ? 'active' : '';
        //console.log('link props', this.props);
        //var link = Router.Link(this.props);
        //var link = (
        //    <Router.Link {...this.props} />
        //);

        return (
            <li className={className}>
                <Router.Link {...this.props}></Router.Link>
            </li>
        );
    }
});
