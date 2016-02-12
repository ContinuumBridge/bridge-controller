
var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

module.exports = {

    statusHash: {
        operational: "",
        should_install: "Waiting for bridge to start installation",
        downloading: "Downloading onto bridge",
        installing: "Installing onto bridge",
        should_uninstall: "Waiting for bridge to start uninstalling",
        uninstalling: "Uninstalling from bridge"
    },

    errorStatusHash: {
        install_error: "Error installing: ",
        uninstall_error: "Error uninstalling: ",
        not_uninstalled: "Not uninstalled",
        error: "Error: "
    },

    getStatus: function(install) {

        var statusLabel;
        var status = install.get('status');
        if (!status || status == 'operational') return "";
        statusLabel = this.statusHash[status];

        if (statusLabel) return (<OverlayTrigger placement='top'
                                    overlay={<Tooltip id="install-status">{statusLabel}</Tooltip>}>
                                    <Portal.Components.Spinner />
                                 </OverlayTrigger>);

        statusLabel = this.errorStatusHash[status];
        if (statusLabel) {
            return (<OverlayTrigger placement='top'
                        overlay={<Tooltip>{statusLabel}</Tooltip>}>
                        <i className="icon ion-alert-circled icon-error item-icon-button"/>
                    </OverlayTrigger>);
        } else {
            return "";
        }
    }
}
