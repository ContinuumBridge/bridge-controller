
CBApp.AppView = Marionette.ItemView.extend({
    
    tagName: 'li',
    className: 'new-item',
    template: '#appItemViewTemplate',

    events: {
        //'click': 'eventWrapperClick',
        //'click #interest-button': 'interestButtonClick',
    },
});

CBApp.AppListView = Marionette.CollectionView.extend({
    
    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.AppView,

    onRender : function(){
      console.log("AppListView Rendered");
    }
});

CBApp.AppLayoutView = Marionette.Layout.extend({
    template: '#appSectionTemplate',
    regions: {
        appList: '#app-list',
        appOptions: '#app-options'
    },  
    onRender: function() {
        console.log('AppLayoutView rendered', this);
        var appListView = new CBApp.AppListView({ collection: this.collection }); 
        //var optionView = new CBApp.AppOptionsView({});
    
        this.appList.show(appListView);
        //this.appOptions.show(optionView);
    }   
});


