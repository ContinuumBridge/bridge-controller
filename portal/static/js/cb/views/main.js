
var Nav = require('./nav');

module.exports = React.createClass({
    mixins: [ Router.State ],

    render: function () {
        var activeSection = this.getParams().section;
        console.log('mainView params', this.getParams());
        return (
            <div>
                <Nav.Topbar activeSection={activeSection}/>
                <div className="container">
                    <Router.RouteHandler/>
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
