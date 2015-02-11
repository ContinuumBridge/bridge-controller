
var Q = require('q');

//require('../../views/generic-views');
//require('../../views/regions');

require('../../apps/views');


module.exports.Main = React.createClass({

    mixins: [ Router.State, Backbone.React.Component.mixin],

    renderModals: function () {

    },

    render: function() {

        var apps = Portal.appCollection;
        console.log('Market View apps', apps);
        return (
            <div>
                <div className="row">
                    <div ref="appSection" className="app-section col-md-6">
                        <Portal.AppListView collection={apps} />
                    </div>
                </div>
            </div>
        )
    }
});
