
var React = require('react')
    ;

React.ListItem = require('./ListItem.jsx');
React.Modal = require('react-bootstrap').Modal;
React.ModalTrigger = require('react-bootstrap').ModalTrigger;
React.OverlayMixin = require('react-bootstrap').OverlayMixin;

//React.AutosizeInput = require('react-input-autosize');

React.Button = require('react-bootstrap').Button;
React.Table = require('react-bootstrap').Table;

//React.Accordion = require('./Accordion.jsx');
//React.Panel = require('./Panel.jsx');
//React.Panel = require('react-bootstrap').Panel;

//var Router = require('react-router');
//React.Router = Router;
//{ React.Route, React.DefaultRoute, React.RouteHandler, React.Link } = React.Router;
//React.Route = Router.Route;

module.exports = React;
/*
React.createBackboneClass = function(spec) {
    var currentMixins = spec.mixins || [];

    spec.mixins = currentMixins.concat([
        backboneMixin
    ]);

    return React.createClass(spec);
};

React.ItemView = React.createClass({
    mixins: [backboneMixin],
    render: function () {
        return <div>Hello, {this.props.name}!</div>
    }
});

React.ListView = React.createClass({
    mixins: [backboneMixin],
    createItem: function (item) {
        return <div>{item}</div>;
    },
    setCollection: function(collection) {

    },
    /*
    componentWillReceiveProps: function(newProps, oldProps){
        this.setState(this.getInitialState(newProps));
    },
    render: function () {
        return <div>{this.props.collection.map(this.createItem)}</div>;
    }
});
*/

module.exports = React;
