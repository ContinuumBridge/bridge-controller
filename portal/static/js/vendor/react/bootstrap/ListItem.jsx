'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Collapse = require('react-bootstrap').Collapse;

var _Collapse2 = _interopRequireDefault(_Collapse);

var Panel = _react2['default'].createClass({
    displayName: 'Panel',

    mixins: [_BootstrapMixin2['default']],

    propTypes: {
        collapsible: _react2['default'].PropTypes.bool,
        onSelect: _react2['default'].PropTypes.func,
        header: _react2['default'].PropTypes.node,
        id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
        footer: _react2['default'].PropTypes.node,
        defaultExpanded: _react2['default'].PropTypes.bool,
        expanded: _react2['default'].PropTypes.bool,
        eventKey: _react2['default'].PropTypes.any,
        headerRole: _react2['default'].PropTypes.string,
        panelRole: _react2['default'].PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            bsClass: 'panel',
            bsStyle: 'default',
            defaultExpanded: false
        };
    },

    getInitialState: function getInitialState() {
        return {
            expanded: this.props.defaultExpanded
        };
    },

    handleSelect: function handleSelect(e) {
        e.selected = true;

        if (this.props.onSelect) {
            this.props.onSelect(e, this.props.eventKey);
        } else {
            e.preventDefault();
        }

        if (e.selected) {
            this.handleToggle();
        }
    },

    handleToggle: function handleToggle() {
        this.setState({ expanded: !this.state.expanded });
    },

    isExpanded: function isExpanded() {
        return this.props.expanded != null ? this.props.expanded : this.state.expanded;
    },

    render: function render() {
        console.log('ListItem render');
        var _props = this.props;
        var headerRole = _props.headerRole;
        var panelRole = _props.panelRole;

        var props = _objectWithoutProperties(_props, ['headerRole', 'panelRole']);

        console.log('this.props.collapsible', this.props.collapsible);

        return _react2['default'].createElement(
            'div',
            _extends({}, props, {
                className: _classnames2['default'](this.props.className, this.getBsClassSet()),
                id: this.props.collapsible ? null : this.props.id, onSelect: null }),
            this.renderHeading(headerRole),
            this.props.collapsible ? this.renderCollapsibleBody(panelRole) : this.renderBody(),
            this.renderFooter()
        );
    },

    renderCollapsibleBody: function renderCollapsibleBody(panelRole) {
        console.log('renderCollapsibleBody', renderCollapsibleBody);
        var props = {
            className: this.prefixClass('collapse'),
            id: this.props.id,
            ref: 'panel',
            'aria-hidden': !this.isExpanded()
        };
        if (panelRole) {
            props.role = panelRole;
        }

        return _react2['default'].createElement(
            _Collapse2['default'],
            { 'in': this.isExpanded() },
            _react2['default'].createElement(
                'div',
                props,
                this.renderBody()
            )
        );
    },

    renderBody: function renderBody() {

        console.log('ListItem renderBody');
        return (
            <div className="panel-body item-body" ref="body">
                {this.props.children}
            </div>
        );
        /*
        var allChildren = this.props.children;
        var bodyElements = [];
        var panelBodyChildren = [];
        var bodyClass = this.prefixClass('body');

        function getProps() {
            return { key: bodyElements.length };
        }

        function addPanelChild(child) {
            bodyElements.push(_react.cloneElement(child, getProps()));
        }

        function addPanelBody(children) {
            bodyElements.push(_react2['default'].createElement(
                'div',
                _extends({ className: bodyClass }, getProps()),
                children
            ));
        }

        function maybeRenderPanelBody() {
            if (panelBodyChildren.length === 0) {
                return;
            }

            addPanelBody(panelBodyChildren);
            panelBodyChildren = [];
        }

        // Handle edge cases where we should not iterate through children.
        if (!Array.isArray(allChildren) || allChildren.length === 0) {
            if (this.shouldRenderFill(allChildren)) {
                addPanelChild(allChildren);
            } else {
                addPanelBody(allChildren);
            }
        } else {

            allChildren.forEach((function (child) {
                if (this.shouldRenderFill(child)) {
                    maybeRenderPanelBody();

                    // Separately add the filled element.
                    addPanelChild(child);
                } else {
                    panelBodyChildren.push(child);
                }
            }).bind(this));

            maybeRenderPanelBody();
        }

        return bodyElements;
        */
    },

    shouldRenderFill: function shouldRenderFill(child) {
        return _react2['default'].isValidElement(child) && child.props.fill != null;
    },

    renderHeading: function renderHeading(headerRole) {
        console.log('ListItem renderHeading');
        /*
        var header = this.props.header;

        if (!header) {
            return null;
        }

        if (!_react2['default'].isValidElement(header) || Array.isArray(header)) {
            header = this.props.collapsible ? this.renderCollapsibleTitle(header, headerRole) : header;
        } else {
            var className = _classnames2['default'](this.prefixClass('title'), header.props.className);

            if (this.props.collapsible) {
                header = _react.cloneElement(header, {
                    className: className,
                    children: this.renderAnchor(header.props.children, headerRole)
                });
            } else {
                header = _react.cloneElement(header, { className: className });
            }
        }
        */

        var title = this.props.title;

        var renderedTitle = React.isValidElement(title) ? title
            : <div className="inner-item-title">{title}</div>;

        var subtitle = this.props.subtitle;
        var renderedSubtitle = React.isValidElement(subtitle) ? subtitle
            : <div className="inner-item-subtitle">{subtitle}</div>;

        // Render custom buttons
        var renderedButtons = this.props.renderButtons;
        var renderedButtons = renderedButtons ? renderedButtons() : "";

        var buttons = this.props.buttons || [];
        console.log('buttons ', buttons );

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
                    {buttons.map(this.renderButton)}
                    {renderedButtons}
                </div>
            </div>
        );
        /*
        return _react2['default'].createElement(
            'div',
            { className: this.prefixClass('heading') },
            header
        );
        */
    },

    renderAnchor: function renderAnchor(header, headerRole) {

        /*
        return (
            <a
                href={'#' + (this.props.id || '')}
                className={this.isExpanded() ? null : 'collapsed'}
                aria-controls={this.props.collapsible ? this.props.id : null},
                onClick={this.handleSelect}>
                <i className="icon ion-chevron-right item-anchor" />
            </a>
        );
        */

        return _react2['default'].createElement(
            'a',
            {
                href: '#' + (this.props.id || ''),
                'aria-controls': this.props.collapsible ? this.props.id : null,
                className: this.isExpanded() ? null : 'collapsed',
                'aria-expanded': this.isExpanded(),
                'aria-selected': this.isExpanded(),
                onClick: this.handleSelect,
                role: headerRole },
            <i className="icon ion-chevron-right item-anchor" />
        );
        /*
        return _react2['default'].createElement(
            'a',
            {
                href: '#' + (this.props.id || ''),
                'aria-controls': this.props.collapsible ? this.props.id : null,
                className: this.isExpanded() ? null : 'collapsed',
                'aria-expanded': this.isExpanded(),
                'aria-selected': this.isExpanded(),
                onClick: this.handleSelect,
                role: headerRole },
            header
        );
        */
    },

    renderCollapsibleTitle: function renderCollapsibleTitle(header, headerRole) {
        return _react2['default'].createElement(
            'h4',
            { className: this.prefixClass('title'), role: 'presentation' },
            this.renderAnchor(header, headerRole)
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
    },

    renderFooter: function renderFooter() {
        if (!this.props.footer) {
            return null;
        }

        return _react2['default'].createElement(
            'div',
            { className: this.prefixClass('footer') },
            this.props.footer
        );
    }
});

exports['default'] = Panel;
module.exports = exports['default'];