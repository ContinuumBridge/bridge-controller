
var React = require('react');

Portal.BridgeStatusView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    render: function() {

        var bridge = this.props.model;
        var name = bridge.get('name');

        return (
            <div>
                <h2>Status</h2>
                <ul className="animated-list device-list">
                    <li className="panel">
                        <div className="panel-heading">
                            <table className="table">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">CBID:</th>
                                        <td>{bridge.get('cbid')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Description: </th>
                                        <td>{bridge.get('description')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Status: </th>
                                        <td>{bridge.get('status') + bridge.get('status_message')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
});
