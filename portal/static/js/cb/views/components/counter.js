
module.exports = React.createClass({

    mixins: [ Portal.Mixins.Counter ],

    handleIncrement: function() {
        this.incrementField(this.props.model, 'installs_permitted', 1);
    },

    handleDecrement: function() {
        this.incrementField(this.props.model, 'installs_permitted', -1);
    },

    render: function() {

        var licence = this.props.model;

        var installsPermitted = licence.get('installs_permitted');
        var disabled = licence.isSyncing();

        return (
            <div className="input-group counter">
                <span className="input-group-btn data-dwn">
                    <button className="btn btn-default btn-info"
                            onClick={this.handleDecrement} data-increment="-1">
                        <span className="glyphicon glyphicon-minus"></span>
                    </button>
                </span>
                <input type="text" className="form-control number text-center"
                    readonly="true" disabled={disabled} value={installsPermitted} />
                <span className="input-group-btn data-up">
                    <button className="btn btn-default btn-info"
                            onClick={this.handleIncrement} data-increment="1">
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </span>
            </div>
        )
    }
});

