
module.exports = React.createClass({

    mixins: [Portal.ReactBackboneMixin],

    handleClick: function() {

        //var model = this.getModel();
        var model = this.props.model;

        if (!model.isSyncing()) {
            if (model.isNew()) {
                console.log('handleClick save');
                //model.save();
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: model.__proto__.constructor.modelType,
                    payload: model
                });
            } else {
                console.log('handleClick destroyOnServer');
                model.destroyOnServer();
            }
        }
    },

    render: function() {

        var model = this.props.model;

        var label = this.props.label;

        var disabled = model.isSyncing() ? 'disabled' : '';;
        var active = !model.get('isGhost') ? 'active' : '';
        var switchClass = "left theme-green animate toggle-switch " + active + " " + disabled;

        return (
            <li className="inner-item">
                <div className={switchClass} onClick={this.handleClick}></div>
                <div className="list-label">{label}</div>
            </li>
        )
    }
});

