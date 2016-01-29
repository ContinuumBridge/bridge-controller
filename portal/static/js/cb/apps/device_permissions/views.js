
var React = require('react');

Portal.AppDevicePermissionView = React.createClass({
    mixins: [Portal.InnerItemView],

});

Portal.AppDevicePermissionListView = React.createClass({

    mixins: [Portal.InnerListView],

    getDefaultProps: function () {
        return {
            title: 'Connect devices'
        };
    },

    createItem: function(adp) {

        var cid = adp.cid;
        //var adp = this.getCollection().get({cid: cid});;
        var label = adp.get('deviceInstall').get('friendly_name');

        return < Portal.Components.Switch key={cid} label={label} model={adp} />
    }
});
