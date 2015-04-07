
/*
var React = require('react');

var joinClasses = require('../../../../../node_modules/react-bootstrap/lib/utils/joinClasses');
var classSet = require('../../../../../node_modules/react-bootstrap/lib/utils/classSet');
//var cloneWithProps = require('../../../../../node_modules/react-bootstrap/lib/utils/cloneWithProps');

var BootstrapMixin = require('../../../../../node_modules/react-bootstrap/lib/BootstrapMixin');
var CollapsableMixin = require('react-bootstrap').CollapsableMixin;
*/

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var React = _interopRequire(_react);

var cloneElement = _react.cloneElement;

var BootstrapMixin = _interopRequire(require("../../../../../node_modules/react-bootstrap/lib/BootstrapMixin"));

var classSet = _interopRequire(require("../../../../../node_modules/react-bootstrap/node_modules/classnames"));


var CollapsableMixin = require('react-bootstrap').CollapsableMixin;

var ListItem = React.createClass({
    mixins: [BootstrapMixin, CollapsableMixin],

    propTypes: {
        onSelect: React.PropTypes.func,
        header: React.PropTypes.node,
        footer: React.PropTypes.node,
        eventKey: React.PropTypes.any
    },

    getDefaultProps: function () {
        return {
            bsClass: 'panel',
            bsStyle: 'default'
        };
    },

    handleSelect: function (e) {
        if (this.props.onSelect) {
            this._isChanging = true;
            this.props.onSelect(this.props.eventKey);
            this._isChanging = false;
        }

        e.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });
    },

    shouldComponentUpdate: function () {
        return !this._isChanging;
    },

    getCollapsableDimensionValue: function () {
        return this.refs.body.getDOMNode().offsetHeight;
    },

    getCollapsableDOMNode: function () {
        if (!this.isMounted() || !this.refs || !this.refs.panel) {
            return null;
        }

        return this.refs.panel.getDOMNode();
    },

    render: function () {
        var classes = this.getBsClassSet();
        classes['panel'] = true;
        //classes = joinClasses(classes, this.props.className);

        return (
            // ADDED replace div with li
            <li {...this.props} className={classSet(this.props.className, classes)}
                onSelect={null}>
        {this.renderHeading()}
        {this.props.collapsable ? this.renderCollapsableBody() : ''}
        {this.renderFooter()}
            </li>
        );
    },

    renderCollapsableBody: function () {
        return (
            <div className={classSet(this.getCollapsableClassSet('panel-collapse'))} id={this.props.id} ref="panel">
        {this.renderBody()}
            </div>
        );
    },

    renderBody: function () {
        return (
            <div className="panel-body item-body" ref="body">
        {this.props.children}
            </div>
        );
    },

    renderHeading: function () {
        //var header = this.props.header;

        /*
        if (!header) {
            return null;
        }

        if (!React.isValidElement(header) || Array.isArray(header)) {
            header = this.props.collapsable ?
                this.renderCollapsableTitle(header) : header;
        } else if (this.props.collapsable) {
        if (this.props.collapsable) {
            header = this.props.collapsable ?
                this.renderTitle(header) : header;
            /*
            header = cloneWithProps(header, {
                className: 'panel-title',
                children: this.renderAnchor(header.props.children)
            });
        } else {
            header = cloneWithProps(header, {
                className: 'panel-title item-title'
            });
        }
        */
        var title = this.props.title;

        var renderedTitle = React.isValidElement(title) ? title
            : <div className="inner-item-title">{title}</div>;

        var subtitle = this.props.subtitle;

        var renderedSubtitle = "";
        if (!(this.state.expanded && this.props.hideSubtitleOnExpanded)) {
            renderedSubtitle = React.isValidElement(subtitle) ? subtitle
                : <div className="inner-item-subtitle">{subtitle}</div>;
        }
        // Render custom buttons
        var renderButtons = this.props.renderButtons;
        var renderedButtons = renderButtons ? renderButtons() : "";

        var status = this.props.status || "";
        console.log('status is', status);

        var buttons = this.props.buttons || [];

        return (
            <div className="panel-heading item-heading">
                {this.renderAnchor()}
                <h4 className="item-title">{renderedTitle}</h4>
                <h4 className="item-subtitle">
                    <small>
                        {renderedSubtitle}
                    </small>
                </h4>
                <div className="item-buttons">
                    {status}
                    {buttons.map(this.renderButton)}
                    {renderedButtons}
                </div>
            </div>
        );
    },

    renderAnchor: function () {
        return (
            <a
                href={'#' + (this.props.id || '')}
                className={this.isExpanded() ? null : 'collapsed'}
                onClick={this.handleSelect}>
                <i className="icon ion-chevron-right item-anchor" />
            </a>
        );
    },


    renderTitle: function () {

        var title = this.props.title;
        var subTitle = this.props.subTitle;

        var renderedTitle = !React.isValidElement(title) ? title
            : <div className="panel-title item-title">{title}</div>;

        return (
            <h4 className="panel-title item-title">
                {renderedTitle}
            </h4>
        );
    },

    renderFooter: function () {
        if (!this.props.footer) {
            return null;
        }

        return (
            <div className="panel-footer">
        {this.props.footer}
            </div>
        );
    },

    renderButton: function(button) {

        var onClick = button.onClick || function() {};

        switch(button.type) {
            case 'delete':
                return <i className="icon ion-trash-a icon-trash item-icon-button" onClick={onClick}/>
                break;
            case 'text':
                var label = button.label || "";
                var disabled = button.disabled ? "disabled" : "";
                var buttonClass = "btn btn-default " + disabled;
                return (
                    <button className={buttonClass} disabled={disabled} onClick={onClick}>
                        {label}
                    </button>
                )
                break;
            default:
                console.log('Unrecognised button', button);
                return;
        }
    }
});

module.exports = ListItem;