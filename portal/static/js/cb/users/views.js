
Portal.UserLicenceTableView = React.createClass({

    mixins: [ Portal.TableView ],

    getInitialState: function () {
        return {
            title: 'Licences',
            rows: 3,
            filters: {
                search: {
                    prefixes: ['user:', ''],
                    callback: function(model, searchString) {
                        console.log('UserLicenceTableView searchString', searchString);
                        console.log('UserLicenceTableView model', model);
                        var filterRegex = searchString.toLowerCase() + ".*";
                        var searchRegex = QueryEngine.createSafeRegex(filterRegex);
                        var pass = false;
                        _.each(['first_name', 'last_name', 'email'], function(field) {
                            if (searchRegex.test(model.get(field).toLowerCase())) {
                                pass = true;
                            }
                        });
                        return pass;
                    }
                }
            }
        };
    },

    renderHeader: function() {

        var filteredCollection = this.getFilteredCollection();
        var collection = this.props.collection;

        console.log('renderHeader filteredCollection ', filteredCollection );
        console.log('renderHeader collection ', collection );

        return (
            <div className="form-group form-group-sm">
                <Portal.Components.SearchInput collection={collection}
                    filteredCollection={filteredCollection} />
            </div>
        )
        //<input className="form-control" type="text" value={searchString} />
    },

    renderRow: function (user) {
        var cid = user.cid;

        var app = this.props.app;

        /*
        var userCollection = this.getCollection();
        var user = userCollection.get({cid: cid});
        */

        var userName = user.get('first_name') + " " + user.get('last_name');

        var appLicence = app.getLicence(user);

        var installsPermitted = appLicence.get('installs_permitted');

        return (
            <tr key={cid}>
                <td className="shrink">{userName}</td>
                <td className="expand">
                    <Portal.Components.Counter model={appLicence}
                        field="installs_permitted" />
                </td>
            </tr>
        );
    }
});
