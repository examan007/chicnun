
function StateObj (classname) {
    var obj = new Object();
    obj.Classname = classname;
    obj.Parent = null;
    obj.uber = [];
    obj.initialize = function (obj) {
        console.log(this.Classname + '.initialize(); obj=' + JSON.stringify(obj));
    }
    obj.initiate = function (obj) {
        console.log(this.Classname + '.initiate(); obj=' + JSON.stringify(obj));
        return (true);
    }
    obj.terminate = function (obj) {
        console.log(this.Classname + '.terminate(); obj=' + JSON.stringify(obj));
    }
    obj.process = function (obj) {
        console.log(this.Classname + '.process(); obj=' + JSON.stringify(obj));
    }
    return (obj);
}

var Application = {
    Classname: 'Application',
    CurrentControl: null,
    Controls: [],
    getCurrentControl: function () {
        var control = Application.CurrentControl;
        var current = null;
        do {
            current = control
            if (control == null) { } else
            if (typeof (control) === 'undefined') {
                Application.CurrentControl = null;
                control = null;
            } else
            if (control.Parent == null) { } else
            if (typeof (control.Parent) === 'undefined') {
                control.Parent = null;
            } else {
                control = control.Parent;
            }
        } while (control != current);
        return (control);
    },
    initialize: function () {
        var funcname = this.Classname + '.initialize';
        try {
            var dropdown = RepeatObj.getMap('Dropdown');
            $.each(dropdown, function (i, f) {
                var name = f['Key'];
                var operation = f['Operation'];
                var option = Application.createControl('Option' + name);
                if (option == null) {
                    alert(funcname + '(); cannot create option named [' + name + ']');
                } else
                if (typeof (operation) === 'undefined') {
                    console.log(funcname + '(); no operation found!');
                } else {
                    option.Entry = f;
                    option.Parent = Application.createControl(
                        'Control' + operation.substr(1));
                }
            });
        } catch (e) {
            alert(funcname + e.toString());
        }
    },
    createControl: function (classname) {
        var obj = null;
        try {
            var newobj = this.Controls[classname];
            if (typeof(newobj) === 'undefined') {
                newobj = new window[classname](classname);
                this.Controls[classname] = newobj;
            }
            newobj.test = true;
            obj = newobj;
        } catch (e) {
            console.log('createControl(' + classname + ') ' + e.toString());
        }
        return (obj);
    },
    select: function (obj) {
        try {
            var args = obj.id.split("-");
            var done = false;
            var newcontrol = null;
            var levels = ['Control', 'Option', 'Phase'];
            var levelid = 0;
            var cntrlobj = Application.CurrentControl;
            do {
                var classname = levels[levelid] + args[2];
                if (function () {
                    var ret = false;
                    if (cntrlobj == null) { } else
                    if (cntrlobj.Classname === classname) {
                        cntrlobj.process(obj);
                        ret = true;
                    }
                    return (ret);
                } == true) { } else
                if ((newcontrol = Application.createControl(classname)) == null) {
                    levelid += 1;
                    if (levelid >= levels.length) {
                        done = true;
                    }
                } else
                if (newcontrol.initiate(obj) == false) {
                    done = true;
                } else {
                    if (cntrlobj != null) {
                        cntrlobj.terminate(obj);
                    }
                    newcontrol.Name = args[2];
                    newcontrol.initialize(obj);
                    Application.CurrentControl = newcontrol;
                    // Application.writeStatus(this.CurrentControl.Classname);
                    done = true;
                }
            } while (!done);
        } catch (e) {
            console.log(e.toString());
        }
    },
    setState: function (obj, newstate) {
    },   
    changeState(obj, direction) {
    },
    writeStatus: function (msg) {
        var funcname = this.Classname + 'writeStatus';
        var testid = 'Statusbar';
        var element = document.getElementById(testid);
        if (element == null) {
            console.log('' + funcname + '(); no id=[' + testid + ']');
        } else {
            element.childNodes[0].textContent = msg;
        }
    },
    getCurrentControl(ctrlname) {
        if (ctrlname != null) {
            ctrlname = 'Control' + ctrlname;
        } else
        if (Application.CurrentControl == null) {
            ctrlname = 'ControlSearch';
        } else {
            ctrlname = Application.CurrentControl.Classname;
        }
        return (Application.Controls[ctrlname]);
    },
    getCurrentOption(ctrlname) {
        var option = null;
        try {
            var control = Application.getCurrentControl(ctrlname);
            option = control.Option.Name;
        } catch (e) {
            console.log('getCurrentOption() ' + e.toString());
        }
        return (option);
    },
    getOptionEntry(ctrlname) {
        var entry = null;
        try {
            var control = Application.getCurrentControl(ctrlname);
            entry = control.Option.Entry;
        } catch (e) {
            console.log('getOptionEntry() ' + e.toString());
        }
        return (entry);
    }
}
