
var Nav = require('./nav');

module.exports = React.createClass({

    mixins: [ Router.State, Router.Navigation ],

    render: function () {
        //Portal.mainView = this;
        //mainView = this;
        var activeSection = this.getParams().section;
        console.log('mainView getParams()', this.getParams());
        console.log('mainView params', this.props.params);
        //console.log('mainView model', this.getModel());

        //var currentBridge = Portal.getCurrentBridge();
        return (
            <div>
                <Nav.Topbar activeSection={activeSection}/>
                <div className="container">
                    <Router.RouteHandler />
                </div>
            </div>
        );
    }
});

/*
var ConfigViews = require('../modules/config/views');

Portal.MainView = React.createClass({
    mixins: [Backbone.React.Component.mixin],

    render: function() {
        var currentBridge = Portal.getCurrentBridge();
        currentBridge.fetch();
        return (
            <ConfigViews.Main model={currentBridge} />
        )
    }
});
*/
