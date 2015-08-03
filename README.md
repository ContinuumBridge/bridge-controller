Bridge Controller
=================



Fields
------

### AppInstall
#### Status
"status" field has predefined values and can be mapped into a state machine.

"status_message" field contains helpful text about the status - for example the error message accompanying an error state.

status values:
"operational": app is doing fine.
"should_install": Set by the portal, prompts bridge to install app.
"downloading": Set by the bridge, app is being downloaded by the bridge
"installing": Set by the bridge, by the app is being installed on a bridge
"upgrading": A new version of the app is being installed
"install_error": error installing or upgrading app on bridge.
"should_uninstall": Set by the portal, app has been designated for uninstall.
"uninstalling": Set by the bridge, app is being uninstalled
"uninstall_error": Set by the bridge, There was an error uninstalling the app.
"error": Something has gone wrong with the app

### Bridge
#### Status

#### Zwave


### DeviceInstall
#### Status
"status" field has predefined values and can be mapped into a state machine.

"status_message" field contains helpful text about the status - for example the error message accompanying an error state.

status values:
"operational": device is doing fine.
"should_install": Set by the portal, prompts bridge to install device.
"downloading": Set by the bridge, adaptor is being downloaded by the bridge
"installing": Set by the bridge, device (adaptor etc.) is being installed on a bridge
"install_error": error installing device on bridge.
"should_uninstall": Set by the portal, device has been designated for uninstall.
"uninstalling": Not sure if this value is necessary?
"uninstall_error": There was an error uninstalling the device.
"not_uninstalled": This (probably zwave) device was designated for uninstalling on the portal but then the user excluded a different device.
"error": Something has gone wrong with the device