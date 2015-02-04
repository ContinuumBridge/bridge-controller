
module.exports.SearchInput = React.createClass({

    getInitialState: function() {
        return {searchString: ''};
    },

    handleChange: function(e) {
        var searchString = e.target.value;
        this.setState({searchString: searchString});
        //this.filter();
    },

    handleBlur: function(e) {
        this.setState({searchString: e.target.value});
        //this.search();
    },

    handleKeyDown: function(e) {
        if (e.keyCode == 13 ) {
            this.search();
        }
        this.filter();
    },

    filter: function(searchString ) {

        var searchString = this.state.searchString;
        console.log('filter searchString', searchString);
        var filteredCollection = this.props.filteredCollection;
        filteredCollection.setSearchString('user:' + searchString);
        filteredCollection.query();
    },

    /*
    getFilteredCollection: function() {

        var collection = this.props.collection;

        var filteredCollection = this.filteredCollection
            || collection.createLiveChildCollection(collection.models);

        collection.setFilter('search', filter);

        filteredCollection.parent = collection;
    },
    */

    search: function() {
        var collection = this.props.collection;
        console.log('Search collection', collection);
        var searchString = this.state.searchString;
        collection.fetch({data: { 'first_name__istartswith': searchString }});
        /*
        var model = this.props.model;
        var value = this.state.value;
        console.log('SearchBox submit model', model );
        if (value != model.get(this.props.field)) {
            model.set(this.props.field, value);
            model.save();
            //this.setState({value: void 0});
        }
        */
    },

    render: function() {

        //var model = this.props.model;
        var searchString = this.state.searchString;
        //var disabled = model.isSyncing();
        return (
            <div className="input-group">
                <input type="text" className="form-control input-text" value={searchString}
                    onChange={this.handleChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
                <span className="input-group-btn">
                    <button className="btn btn-default"
                        type="button" onClick={this.search} >Search</button>
                </span>
            </div>
        )
    }
});
