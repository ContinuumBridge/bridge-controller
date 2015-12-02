
var React = require('react');

Portal.CurrentUserView = React.createClass({

    //mixins: [ Portal.ItemView],

    render: function() {

        var TextInput = Portal.Components.TextInput;
        var currentUser = Portal.currentUser;
        var title = "My Profile";

        return (
            <div>
                <h2>{title}</h2>
                <ul className="animated-list">
                    <li className="panel">
                        <ul className="nested-list">
                            <li>
                                <TextInput model={currentUser}
                                    autosize={true} field="first_name" />
                                <TextInput model={currentUser}
                                    autosize={true} field="last_name" />
                            </li>
                            <li>
                                <TextInput model={currentUser} field="email" />
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
});
