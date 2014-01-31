
CBApp.HomeLayoutView = Marionette.Layout.extend({
    template: '#homeSectionTemplate',
    regions: {
        appSection: '#app-section',
        deviceSection: '#device-section',
        deviceDiscoverySection: '#device-discovery-section',
        commandPanel: '#command-panel',
    },  
    onRender: function() {
        console.log('HomeLayoutView rendered', this);

        CBApp.filteredAppCollection.filter(CBApp.filters.currentBridge('appInstalls'));
        var appLayoutView = new CBApp.AppLayoutView({ collection: CBApp.filteredAppCollection }); 
        this.appSection.show(appLayoutView);

        CBApp.filteredDeviceCollection.filter(CBApp.filters.currentBridge('deviceInstalls'));
        var deviceLayoutView = new CBApp.DeviceLayoutView({ collection: CBApp.filteredDeviceCollection }); 
        this.deviceSection.show(deviceLayoutView);

        //CBApp.filteredDeviceCollection.where({ name: 'Test Device 2'});

        var commandsView = new CBApp.CommandsView(); 
        this.commandPanel.show(commandsView);

        var deviceDiscoveryLayoutView = new CBApp.DeviceDiscoveryLayoutView({ collection: CBApp.discoveredDeviceCollection });
        this.deviceDiscoverySection.show(deviceDiscoveryLayoutView);
    }   
});

