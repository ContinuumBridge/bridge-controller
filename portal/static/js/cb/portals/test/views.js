
//var cx = require('react/lib/cx');

var SwitchView = React.createClass({

    mixins: [ Swarm.ReactMixin ],

    statics: {
        modelType: "Switch"
    },

    handleClick: function() {
        this.sync.toggle();
    },

    render: function() {

        var testSwitch = this.sync;

        /*
        var bookmark = <noscript/>;
        var tab = this.props.app.isTouch
            ? <span
            className={todo.childList==="" ? "tab" : "tab child-list"}
            onTouchEnd={this._onTabTouch}
            onClick={this._onTabTouch}
        >⇢</span>
            : <noscript/>;

        if (todo.childList) {
            bookmark = <span className="bookmark"> </span>; //&#8594;
        }
        */

        var label = testSwitch.value;

        //var disabled = model.isSyncing() ? 'disabled' : '';;
        var active = testSwitch.value == "on" ? 'active' : '';
        var switchClass = "left theme-green animate toggle-switch " + active;// + " " + disabled;

        return (
            <div className="switch" key={testSwitch._id}>
                <div className={switchClass} onClick={this.handleClick}></div>
                <div className="list-label">{label}</div>
            </div>
        );
    },

    _focus: function () {
        var app = this.props.app;
        app.go(this.props.listId, this.sync._id);
    },

    _onToggle: function () {
        this.sync.toggle();
    },

    _onChange: function(event) {
        var edit = event.target;
        var text = edit.value;
        var pos = edit.selectionStart;
        // save it, send it to everybody
        this.sync.set({text:text});
        // a bit ugly, but React may wreck cursor pos
        this.forceUpdate(function(){
            edit.selectionStart = edit.selectionEnd = pos;
        });
    },

    _onDestroyClick: function() {
        if (this.sync.childList !== ""){
            if (confirm("Sure?")) {
                app.delete(this.props.listId, this.sync._id);
            }
        } else {
            app.delete(this.props.listId, this.sync._id);
        }
    },

    _onTabTouch: function(){
        app.forward();
    }

});

var MainView = React.createClass({

    render: function() {

        var switchView = this.props.swarmApp
            ? <SwitchView spec='/Switch#1'/>
            : "";

        return (
            <div>
                {switchView}
            </div>
        )
    }
});

module.exports = MainView;

