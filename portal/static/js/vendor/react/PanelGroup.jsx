
var React = require('react');

var includeFolder = require('include-folder');

//var utils = includeFolder('./node_modules/react-bootstrap/utils');
//var utils = require('./node_modules/react-bootstrap/utils');
var joinClasses = require('../../../../../node_modules/react-bootstrap/utils/joinClasses');
var classSet = require('../../../../../node_modules/react-bootstrap/utils/classSet');
var cloneWithProps = require('../../../../../node_modules/react-bootstrap/utils/cloneWithProps');

var BootstrapMixin = require('./BootstrapMixin');
var ValidComponentChildren = require('../../../../../node_modules/react-bootstrap/utils/ValidComponentChildren');

var ListItem = React.createClass({
    mixins: [BootstrapMixin],

    propTypes: {
        collapsable: React.PropTypes.bool,
        activeKey: React.PropTypes.any,
        defaultActiveKey: React.PropTypes.any,
        onSelect: React.PropTypes.func,
        onOpen: React.PropTypes.func,
        onClose: React.PropTypes.func
    },

    getDefaultProps: function () {
        return {
            bsClass: 'panel-group',
            // ADDED Set accordion true
            accordion: true
        };
    },

    getInitialState: function () {
        var defaultActiveKey = this.props.defaultActiveKey;

        return {
            activeKey: defaultActiveKey
        };
    },

    render: function () {
        var classes = this.getBsClassSet();
        // ADDED Changed div to li
        return (
            <li {...this.props} className={joinClasses(this.props.className, classSet(classes))} onSelect={null}>
        {ValidComponentChildren.map(this.props.children, this.renderPanel)}
            </li>
            );
    },

    renderPanel: function (child, index) {
        var activeKey =
                this.props.activeKey != null ? this.props.activeKey : this.state.activeKey;

        var props = {
            bsStyle: child.props.bsStyle || this.props.bsStyle,
            key: child.key ? child.key : index,
            ref: child.ref
        };

        if (this.props.accordion) {
            props.collapsable = true;
            props.expanded = (child.props.eventKey === activeKey);
            props.onSelect = this.handleSelect;
        }

        return cloneWithProps(
            child,
            props
        );
    },

    shouldComponentUpdate: function() {
        // Defer any updates to this component during the `onSelect` handler.
        return !this._isChanging;
    },

    handleSelect: function (key) {
        console.log('Accordion select key', key);
        if (this.props.onSelect) {
            this._isChanging = true;
            this.props.onSelect(key);
            this._isChanging = false;
        }

        if (this.state.activeKey === key) {
            key = null;
            // ADDED The item is being closed
            this.setState({open: false});
            if (this.props.onClose) {
                this._isChanging = true;
                this.props.onClose();
                this._isChanging = false;
            }
        } else if (!this.state.activeKey) {
            // ADDED The item is being opened
            this.setState({open: true});
            if (this.props.onOpen) {
                this._isChanging = true;
                this.props.onOpen();
                this._isChanging = false;
            }
        }

        this.setState({
            activeKey: key
        });
    }
});

module.exports = ListItem;
