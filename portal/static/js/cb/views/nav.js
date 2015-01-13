
module.exports.Topbar = React.createClass({

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
                        <a className="home navbar-brand"><strong>Continuum Bridge</strong></a>
                    </div>

                    <div className="collapse navbar-collapse navbar-ex1-collapse" role="navigation">
                        <ul id="navbar-left" className="nav navbar-nav navbar-left">
                            <BridgeList />
                        </ul>
                        <div id="navbar-right" className="nav navbar-nav navbar-right">
                            <li><a className="dashboard">Dashboard</a></li>
                            <li><a className="store">App Store</a></li>
                            <li><a className="config">Config</a></li>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var BridgeList = React.createClass({

    createItem: function() {

        //{this.props.collection.map(this.createItem)}
    },

    render: function () {

        return (
            <li className="dropdown">
                <a href="#" id="bridge-header" className="dropdown-toggle" data-toggle="dropdown">
                    <div class="header-text">Bridges </div><b class="caret"></b>
                </a>
                <ul className="dropdown-menu">
                </ul>
            </li>
        )
    }
});