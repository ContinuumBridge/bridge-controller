
Portal.ReactBackboneMixin = {

    getModel: function() {

        var owner = this._owner;
        if (!owner) return false;
        var collection = owner.getCollection();
        return collection.get({cid: this.props.model.cid})
    }
}

