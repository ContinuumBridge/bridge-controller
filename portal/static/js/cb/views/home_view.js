
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../apps/views');
require('../devices/device_views');
require('../devices/device_discovery_views');
require('./commands_view');

CBApp.HomeLayoutView = Marionette.Layout.extend({
    template: '#homeSectionTemplate',
    regions: {
        appSection: '#app-section',
        deviceSection: '#device-section',
        deviceDiscoverySection: '#device-discovery-section',
        commandPanel: '#command-panel'
    },  
    onRender: function() {

        CBApp.filteredAppInstallCollection.filter(CBApp.filters.currentBridge());
        var appLayoutView = new CBApp.AppLayoutView({ collection: CBApp.filteredAppInstallCollection });
        this.appSection.show(appLayoutView);

        // deviceLayoutView takes the deviceInstall collection
        CBApp.filteredDeviceInstallCollection.filter(CBApp.filters.currentBridge());
        var deviceLayoutView = new CBApp.DeviceLayoutView({ collection: CBApp.filteredDeviceInstallCollection });
        this.deviceSection.show(deviceLayoutView);

        var commandsView = new CBApp.CommandsView();
        this.commandPanel.show(commandsView);

        var deviceDiscoveryLayoutView = new CBApp.DeviceDiscoveryLayoutView({ collection: CBApp.discoveredDeviceCollection });
        this.deviceDiscoverySection.show(deviceDiscoveryLayoutView);
    }   
});

