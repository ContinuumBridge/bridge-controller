
module.exports.RowView = {

    getModel: function() {

        var owner = this._owner;
        //console.log('getModel owner', owner);
        if (!owner) return false;
        var collection = owner.getCollection();
        //console.log('getModel collection', collection);
        //console.log('getModel item', this.props.model);
        var item = this.props.model;
        var query = item.id ? {id: item.id} : {cid: item.cid};
        return collection.findWhere(query);
    },

    getCollection: function() {

        var owner = this._owner;
        if (!owner) return false;
        return owner.getCollection();
    },

    handleDestroy: function() {
        this.getModel().destroy();
    },

    handleDestroyOnServer: function() {
        this.getModel().destroyOnServer();
    },

    render: function() {
        //console.log('ItemView props', this.props);
        var model = this.props.model;
        return (
            <tr key={model.cid}>
                <td className="shrink">{remote} {direction}</td>
                <td className="expand">{message.body}</td>
            </tr>
        );
    }
};

module.exports.TableView = {

    getFilteredCollection: function() {

        var self = this;

        if (this.filteredCollection) {
            return this.filteredCollection;
        } else {

            var collection = this.props.collection;

            this.filteredCollection = collection.createLiveChildCollection(collection.models);

            /*
            this.filteredCollection.on('all', function(event) {
                console.log('filteredCollection event', event)
                //collection.trigger('change');
            });
            */

            this.filteredCollection.setPills(this.state.filters);
            /*
            _.each(this.state.filters, function(filter) {
                self.filteredCollection.setFilter(filter.name, filter.filter);
            });
            */

            return this.filteredCollection;
        }
    },

    render: function() {

        var title = this.state.title || "";

        var header = this.renderHeader ? this.renderHeader() : '';

        console.log('TableView render filteredCollection ', this.getFilteredCollection());

        return (
            <div>
                <h4>{title}</h4>
                {header}
                <div className="table-nested" >
                    <table className="table-condensed table-hover table-striped">
                        <tbody>
                        {this.getFilteredCollection().map(this.renderRow)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};

