

module.exports = {

    getFilteredCollection: function(name, filter) {

        this.filteredCollection = this.filteredCollection || this.getCollection()
                        .createLiveChildCollection(this.getCollection().models);

        this.filteredCollection.setFilter(name, filter);

        return this.filteredCollection;
    }
}