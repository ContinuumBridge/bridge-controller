
var React = require('react');

Portal.AppDevicePermissionView = React.createClass({
    mixins: [Portal.InnerItemView],

});

Portal.AppDevicePermissionListView = React.createClass({

    mixins: [Backbone.React.Component.mixin, Portal.InnerListView],

    getDefaultProps: function () {
        return {
            title: 'Connect devices'
        };
    },

    createItem: function(item) {

        var cid = item.cid;

        var adp = this.getCollection().get({cid: cid});;
        var label = adp.get('deviceInstall').get('friendly_name');

        return < Portal.Components.Switch key={cid} label={label} model={adp} />
    }
});
