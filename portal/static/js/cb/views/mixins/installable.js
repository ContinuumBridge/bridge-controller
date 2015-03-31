
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
        error: "Error: "
    },

    getStatus: function(install) {

        return <React.OverlayTrigger placement='top' overlay={<React.Tooltip>Test tooltip</React.Tooltip>}>
                  <Portal.Components.Spinner />
               </React.OverlayTrigger>;

        var statusLabel;
        var status = install.get('status');
        if (!status || status == 'operational') return "";
        statusLabel = this.statusHash[status];

        if (statusLabel) return <React.OverlayTrigger placement='top'
                                    overlay={<React.Tooltip test='spinnerInfo'>Test tooltip</React.Tooltip>}>
                                    <Portal.Components.Spinner />
                                </React.OverlayTrigger>;

        statusLabel = this.errorStatusHash[status];
        if (statusLabel) {
            return statusLabel
        } else {
            return "";
        }
    }
}
