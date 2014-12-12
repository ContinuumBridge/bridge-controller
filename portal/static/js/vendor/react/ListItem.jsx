var React = require('react');

var joinClasses = require('../../../../../node_modules/react-bootstrap/utils/joinClasses');
var classSet = require('../../../../../node_modules/react-bootstrap/utils/classSet');
var cloneWithProps = require('../../../../../node_modules/react-bootstrap/utils/cloneWithProps');

var BootstrapMixin = require('./BootstrapMixin');
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

        return (
            // ADDED replace div with li
            <li {...this.props} className={joinClasses(this.props.className, classSet(classes))}
                id={this.props.collapsable ? null : this.props.id} onSelect={null}>
        {this.renderHeading()}
        {this.props.collapsable ? this.renderCollapsableBody() : this.renderBody()}
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
        var header = this.props.header;

        if (!header) {
            return null;
        }

        if (!React.isValidElement(header) || Array.isArray(header)) {
            header = this.props.collapsable ?
                this.renderCollapsableTitle(header) : header;
        } else if (this.props.collapsable) {
            header = cloneWithProps(header, {
                className: 'panel-title',
                children: this.renderAnchor(header.props.children)
            });
        } else {
            header = cloneWithProps(header, {
                className: 'panel-title'
            });
        }

        return (
            <div className="panel-heading">
        {header}
            </div>
        );
    },

    renderAnchor: function (header) {
        return (
            <a
                href={'#' + (this.props.id || '')}
                className={this.isExpanded() ? null : 'collapsed'}
                onClick={this.handleSelect}>
        {header}
            </a>
        );
    },

    renderCollapsableTitle: function (header) {
        return (
            <h4 className="panel-title">
                <i className="icon ion-chevron-right edit-button" onClick={this.handleSelect} />
                {this.renderAnchor(header)}
                <i className="icon ion-trash-a uninstall-button" onClick={this.handleDelete} />
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
    }
});

module.exports = ListItem;