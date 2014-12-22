
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
