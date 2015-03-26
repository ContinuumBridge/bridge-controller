
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

    search: function() {
        var collection = this.props.collection;
        var searchString = this.state.searchString;
        collection.fetch({data: { 'first_name__istartswith': searchString }});

    },

    render: function() {

        var searchString = this.state.searchString;
        return (
            <div className="input-group">
                <input type="text" className="form-control" value={searchString}
                    onChange={this.handleChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />
                <span className="input-group-btn">
                    <button className="btn btn-default"
                        type="button" onClick={this.search} >Search</button>
                </span>
            </div>
        )
    }
});
