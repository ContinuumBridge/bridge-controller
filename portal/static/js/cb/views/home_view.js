
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

require('../apps/views');
require('../devices/views');
require('../devices/discovery/views');
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

        // appLayoutView takes the filtered appInstall collection
        CBApp.filteredAppInstallCollection.filter(CBApp.filters.currentBridge());
        var appLayoutView = new CBApp.AppLayoutView({ collection: CBApp.filteredAppInstallCollection });
        this.appSection.show(appLayoutView);

        // deviceLayoutView takes the filtered deviceInstall collection
        CBApp.filteredDeviceInstallCollection.filter(CBApp.filters.currentBridge());
        var deviceLayoutView = new CBApp.DeviceLayoutView({ collection: CBApp.filteredDeviceInstallCollection });
        this.deviceSection.show(deviceLayoutView);

        var commandsView = new CBApp.CommandsView();
        this.commandPanel.show(commandsView);

        CBApp.filteredDiscoveredDeviceInstallCollection.filter(CBApp.filters.currentBridge());
        var deviceDiscoveryLayoutView = new CBApp.DeviceDiscoveryLayoutView({
            collection: CBApp.discoveredDeviceInstallCollection
        });
        this.deviceDiscoverySection.show(deviceDiscoveryLayoutView);
    }   
});

