
var Backbone = require('backbone-bundle');
var React = require('react');
//var Router = require('react-router');
//var Q = require('q');

require('../apps/views');

module.exports.Main = React.createClass({

    mixins: [ Backbone.React.Component.mixin ],

    renderModals: function () {

    },

    render: function() {

        var apps = Portal.appCollection;

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
