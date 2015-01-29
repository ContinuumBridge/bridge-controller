

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
                        <TextInput model={currentUser} field="first_name" />
                        <TextInput model={currentUser} field="last_name" />
                        <TextInput model={currentUser} field="email" />
                    </li>
                </ul>
            </div>
        )
    }
});
