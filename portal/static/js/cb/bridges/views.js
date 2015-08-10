
Portal.BridgeStatusView = React.createClass({

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
                                        <th scope="row">Connected: </th>
                                        <td>{bridge.get('connected') || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Status: </th>
                                        <td>{bridge.get('status') + bridge.get('status_message')}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Z Wave: </th>
                                        <td>{bridge.get('zwave')}</td>
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

/*
Portal.BridgeView = React.createClass({

    renderBody: function() {

        var self = this;

        return (
            <li className="panel">
                <div className="panel-heading item-heading">
                    Bridge details
                </div>
            </li>
        );
    }
});

Portal.BridgeListView = React.createClass({

    itemView: Portal.BridgeView,

    mixins: [Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Bridge'
        };
    },

    renderItem: function (bridge) {

        var cid = bridge.cid;

        return < Portal.BridgeView key={cid} model={bridge} />
    }
});

 */
