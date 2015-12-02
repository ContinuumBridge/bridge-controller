
var React = require('react');

module.exports = React.createClass({

    mixins: [ Portal.Mixins.Counter ],

    render: function() {

        var model = this.props.model;

        var value = model.get(this.props.field);
        var disabled = model.isSyncing();

        var counterClass = "input-group counter-" + this.props.size;
        return (
            <div className={counterClass}>
                <span className="input-group-btn data-dwn">
                    <button className="btn btn-default"
                            onClick={this.handleDecrement} data-increment="-1">
                        <span className="glyphicon glyphicon-minus btn-icon"></span>
                    </button>
                </span>
                <input type="text" className="form-control number text-center"
                    readonly="true" disabled={disabled} value={value} />
                <span className="input-group-btn data-up">
                    <button className="btn btn-default"
                            onClick={this.handleIncrement} data-increment="1">
                        <span className="glyphicon glyphicon-plus btn-icon"></span>
                    </button>
                </span>
            </div>
        )
    }
});


