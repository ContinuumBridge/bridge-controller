
//var cx = require('react/lib/cx');

var SwitchView = React.createClass({

    mixins: [ Swarm.ReactMixin ],

    statics: {
        modelType: "Switch"
    },

    render: function() {

        var cbSwitch = this.sync;

        console.log('swarm react cbSwitch is', cbSwitch);
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

        var label = cbSwitch.value ? "True" : "False";
        return (
            <div className="switch" key={cbSwitch._id}>
                Test switch is {label}
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

module.exports = SwitchView;