
CBApp.BridgeItemView = Marionette.ItemView.extend({
    
    tagName: 'li',
    attributes : function () {

        console.log('name in BridgeItemView', this.model);
        return {
          // Show the bridge as active if it is the current bridge
          class : (this.model === CBApp.currentBridge) ? 'active' : '',
          name: this.model.get('name'),
        };
    },
    template: '#bridgeItemViewTemplate',

    events: {
        'click': 'bridgeClick'
        //'click #interest-button': 'interestButtonClick',
    },

    bridgeClick: function() {
        CBApp.currentBridge = this.model;
    }
});

CBApp.BridgeDropdownView = Marionette.CompositeView.extend({
    
    tagName: 'li',
    className: 'dropdown',
    itemView: CBApp.BridgeItemView,
    itemViewContainer: '#bridge-list',
    template: '#bridgeDropdownTemplate',

    onRender : function(){
      //console.log("DeviceListView Rendered")
      //this.setElement('Test Html');
    }
});

CBApp.NavLayoutView = Marionette.Layout.extend({

    template: '#navSectionTemplate',
    className: 'container',

    regions: {
        //bridgeDropdown: '#bridge-dropdown'
        navbarLeft: '#navbar-left'
        //bridgeDropdown: { selector: '#bridge-dropdown', regionType: CBApp.NowrapRegion }
        //bridgeList: { selector: '#bridge-list' }
    },  

    onRender: function() {
        console.log('NavLayoutView rendered', this);
        var bridgeDropdownView = new CBApp.BridgeDropdownView({ collection: CBApp.bridgeCollection });
        this.navbarLeft.show(bridgeDropdownView);
    }   
});

