
var UserObj = angular.module('useApp', []);
UserObj.controller('UseController', ['$scope', function ($scope) {
    var useList = this;
    useList.scope = $scope;
    RepeatObj.useList = useList;
    useList.debug = 1;
    useList.title = 'New';
    useList.panel = 'Account';
    useList.authkey = 'auth.php';
    useList.entry = null;
    useList.focus = '';
    useList.objects = [];
    useList.results = [];
    useList.newvals = [];
    useList.fields = [];
    useList.checkcomplete = null;
    useList.cancel = null;
    useList.actions = [];
    useList.savedobjects = [];
    useList.data = null;
    useList.complete = null;
    useList.iregex = null;
    useList.operation = null;
    useList.setModal = function (sectionname) {
        useList.dialog = new ModalObj(sectionname + '-Modal');
        useList.panel = sectionname;
        try {
            useList.span = document.getElementsByClassName("close")[1];
            useList.span.onclick = function () {
                useList.dialog.modal.style.display = "none";
            }
        } catch (e) {
            console.log('useList=' + e.toString());
        }
        return (useList.dialog);
    }
    useList.setModal(useList.panel);
    useList.initData = function () {
        if (useList.data == null) {
        } else
        if (useList.objects == null) {
            console.log('useList.initData(); objects=null');
        } else {
            for (var i = 0; i < useList.objects.length; i++) {
                var obj = useList.objects[i];
                if(i < useList.savedobjects.length) {
                    console.log('saved=' + JSON.stringify(useList.savedobjects[i]));
                    check(obj, useList.savedobjects[i]['value']);
                    continue;
                }
                var data = JSON.parse(JSON.stringify(useList.data));
                console.log('obj=' + JSON.stringify(obj));
                console.log('data=' + JSON.stringify(useList.data));
                if (typeof (data.sequence) === 'undefined') { } else {
                    try {
                        Application.CurrentControl.sequence = parseInt(data.sequence);
                        console.log(Application.CurrentControl.Classname + '[' + data.sequence + ']');
                    } catch (e) {
                        alert(e.toString());
                    }
                }
                function check(obj, value) {
                    console.log('old value=[' + obj['value'] + ']');
                    if (useList.checkAttr(obj, value, 'input') == false) {
                        obj['value'] = value;
                    }
                    console.log('value=[' + obj['value'] + ']');
                }
                if (typeof(data[obj.name]) === 'undefined') {
                    check(obj, "");
                } else
                for (var key in data) {
                    console.log('key=[' + key.toString() + ']');
                    if (obj.name === key) {
                        check(obj, data[key]);
                        break;
                    }
                }
            }
            useList.savedobjects = [];
        }
    }
    useList.addData = function (data) {
        useList.data = data;
        console.log('useList.addData()' + JSON.stringify(useList.data));
    }
    useList.setActions = function (entry) {
        var test = Application.getOptionEntry(null);
        if (test != null) {
            entry = test;
        }
        useList.forceActions(entry);
    }
    useList.forceActions = function (entry) {
        console.log('useList.setActions() ' + JSON.stringify(entry));
        if (entry == null) { } else {
            if (typeof (entry.Action) === 'undefined') { } else {
                useList.actions = entry.Action.split('|');
                if (useList.actions[0] !== 'Go') {
                }
            }
            useList.entry = entry;
        }
    }
    useList.update = function () {
        try {
            useList.scope.$apply();
        } catch (e) {
            console.log(e);
        }
    }
    useList.setInitial = function (obj) {
        obj.value = obj.initial;
        if (obj.type === 'password') {
            obj.savetype = obj.type;
            obj.type = 'text';
        } else {
            obj.savetype == null;
        }
        console.log('useList.setInitial(); set ... [' + obj.value + ']');
    }
    useList.isInitial = function (obj, value) {
        var ret = false;
        var test = new String(obj.initial);
        if (typeof (test) === 'undefined') { } else
        if (test.indexOf(value) == 0) {
             ret = true;
        }
        return (ret)
    }
    useList.setFocus = function (entry) {
        var funcname = useList.title + '.useList.setFocus';
        console.log(funcname + '() ' + JSON.stringify(entry));
        if (entry == null) { } else
        if (typeof (entry.Focus) === 'undefined') { } else
        try {
            useList.focus = entry.Focus;
            var id = useList.panel + '-Input-' + entry.Focus;
            var element = document.getElementById(id);
            element.focus();
            console.log(funcname + '() [' + id + ']');
        } catch (e) {
            console.log(funcname + '()=' + toString());
        }
    }
    useList.findAttribute = function (listname, attrname) {
        var funcname = 'useList.findAttributes';
        return (RepeatObj.getEntry(listname, 'name', attrname));
    }
    useList.initPicker = function (name) {
        var funcname = 'useList.initPicker';
        console.log(funcname + '(); executing ... name=[' + name + ']');
        var entry = useList.findAttribute(useList.title, name);
        if (entry == null) {
            console.log('NOT found! [' + useList.title + ':name:' + name + ']');
        } else
        if (typeof (entry.picker) === 'undefined') {
            console.log(funcname = '(); entry.picker undefined!');
        } else {
            var id = '#' + useList.panel + '-Input-' + name
            console.log(funcname + '(); id=[' + id + ']');
 //           jQuery(id).datetimepicker();
        }
        console.log(funcname + '(); done!');
    }
    useList.clearObjects = function (flag) {
        for (var i = 0; i < useList.objects.length; i++) {
            var obj = useList.objects[i];
            if (obj.value.length <= 0 || flag == true) {
                useList.setInitial(obj);
            }
        }
    }
    useList.initialize = function (mapname, flag) {
        var ret = false;
        var objects = RepeatObj.sortMap(mapname, 'index');
        console.log('useList.initialize(' + mapname + '); executing ...');
        if (objects == null) {
            console.log('Cannot find map name=[' + mapname + ']');
        } else {
            try {
                //useList.results = [];
                useList.dialog.hide();
            } catch (e) {
                console.log(e.toString());
            }
            console.log('useList.initialize(' + objects.length + ');');
            useList.objects = objects;
            useList.clearObjects(flag);
            useList.setActions(useList.entry);
            useList.title = mapname;
            useList.initData();
            useList.update();
            useList.setFocus(useList.entry);
            console.log('useList.initialize(' + mapname + ') [' + useList.objects.length + ']; done!');
            ret = true;
            var id = '';
            if (useList.actions.length <= 0) {
                console.log('No actions for [' + mapname + ']');
            } else
                try {
                    id = useList.panel + '-Save-' + useList.actions[useList.actions.length - 1];
                    console.log('useList.update() [' + id + ']');
                    /*                $(window).keydown(function (event) {
                                        if (event.keyCode == 13) {
                                            $('#' + id).click();
                                        }
                                    });
                    */            } catch (e) {
                console.log('useList.update() [' + id + '] ' + e.toString());
            }
        }
        return (ret);
    }
    useList.onFocus = function (obj) {
        console.log('onFocus before testing $scope.value=[' + obj.value + ']');
        if (obj.name === 'stylist') {
            console.log('useList.entry=' + JSON.stringify(useList.entry));
            console.log('useList.data=' + JSON.stringify(useList.data));
            function editevent(data) {
                var event = data;
                useList.savedobjects = [];
                for (var i = 0; i < useList.objects.length; i++) {
                    useList.savedobjects.push(JSON.parse(JSON.stringify(useList.objects[i])));
                    console.log('onFocus()' + JSON.stringify(useList.savedobjects));
                }
                return (function () {
                    useList.StylistUserId = Controller.StylistUserId;
                    Controller.editEvent(event, function () {
                        console.log('editEvent();');
                    })
                })
            }
            Controller.editeventstage = editevent(useList.data);
            Controller.select({
                id: 'Toolbar-Option-Search-Stylist',
                selected: true
            })
        } else
        if (useList.focus === obj.name) {
            console.log('onFocus()' +
                ' useList.focus=[' + useList.focus + ']' +
                ' obj.name=[' + obj.name + ']');
        } else {
            if (obj.value === obj.initial) {
                obj.value = '';
            }
            if (obj.savetype != null) {
                obj.type = obj.savetype;
            }
        }
    }
    useList.onClick = function (obj) {
        alert(JSON.stringify(obj));
    }
    useList.onKeyup = function (obj) {
        console.log('onKeyup() before testing $scope.value=[' + obj.value + ']');
        obj.precheck = true;
        obj.save_minlength = obj.minlength;
        obj.minlength = 0;
        if (useList.checkAttr(obj, obj.value, 'validate') == false) {
            if (obj.value.length <= 0) {} else
            if (useList.results.length > 0) {} else {
                useList.results.push({
                    name: 'Invalid',
                    message: obj.message //'character typed is not allowed.'
                });
            }
            if (useList.results.length > 0) {
                try {
                    useList.dialog.show();
                } catch (e) {
                    console.log('onKeyup' + e.toString());
                }
            }
            obj.value = obj.value.substr(0, obj.value.length - 1);
        }
        obj.minlength = obj.save_minlength;
    }
    useList.onKeydown = function (obj) {
        console.log('onKeydown() before testing $scope.value=[' + obj.value + ']');
        if (event.altKey || event.ctrlKey || event.metaKey) {
            console.log('character not allowed!');
        }
        var shift = event.shiftKey;
        var str = String.fromCharCode(event.keyCode);
        console.log('keycode=[' + event.keyCode + ':' + str + ']');
        if (useList.focus === obj.name) {
            if (obj.value === obj.initial) {
                obj.value = '';
            }
            if (obj.savetype != null) {
                obj.type = obj.savetype;
            }
        } else {
            console.log('onKeydown()' +
                ' useList.focus=[' + useList.focus + ']' +
                ' obj.name=[' + obj.name + ']');
        }
    }
    useList.onBlur = function (obj) {
        if (typeof (obj.value) === 'undefined') { } else
        if (obj.value.length <= 0) {
            useList.setInitial(obj);
        }
    }
    useList.setUsername = function (value) {
        Controller.Username = value;
        console.log('useList.setUsername with [' + Controller.Username + ']');
        return (true);
    }
    useList.setPassword = function (value) {
        Controller.Password = value;
        console.log('useList.setPassword with [' + '########' + ']');
        return (true);
    }
    useList.datetime = function (value) {
        return (true);
    }
    useList.checkValue = function (value, obj) {
        var ret = true;
        if (useList.debug > 1) {
            console.log('reg=[' + JSON.stringify(obj) + ']');
        }
        function isValidCharacter (ch) {
            if (typeof (obj.filteregx) === 'undefined') {
                obj.reg = new RegExp('^[ a-z0-9]+$', 'i');
                return ch.match(obj.reg) !== null;
            } else
            if (typeof (obj.filtermod) === 'undefined') {
                obj.reg = new RegExp(obj.filteregx, 'i');
                return ch.match(obj.reg) !== null;
            } else {
                obj.reg = new RegExp(obj.filteregx, obj.filtermod);
                return ch.match(obj.reg) !== null;
            }
            return (false);
        }
        function success(obj, value) {
            obj.message = '';
            return (true);
        }
        if (typeof (obj.minlength) === 'undefined') {
            obj.minlength = 0;
        }
        if (parseInt(obj.minlength) == 0 && value.length == 0) {
            ret = success(obj, value);
        } else
        if (value.length <= 0) {
            obj.message = 'Empty value not allowed.'
            ret = false;
        } else
        if (value.length < parseInt(obj.minlength)) {
            obj.message = 'Not enough characters.';
            ret = false;
        } else
        if ((ret = isValidCharacter(value)) == false) {
            obj.message = 'Value has invalid character.'
        } else
        if (typeof (obj.precheck) !== 'undefined') {
            ret = success(obj, value);
        } else
        if (useList.isInitial(obj, value)) {
            obj.message = 'Value must be entered.'
            ret = false;
        } else {
            ret = success(obj, value);
        }
        obj.result = ret;
        return (ret);
    }
    useList.temppwd = new String();
    useList.confirm = function (value, obj) {
        var ret = false;
        console.log('obj=' + JSON.stringify(obj));
        if (useList.temppwd.indexOf(value) != 0) {
            ret = false;
        } else
        if (typeof (obj.precheck) !== 'undefined') {
            ret = true;
        } else
        if (useList.temppwd.length == value.length) {
            ret = true;
        }
        if (ret == false) {
            obj.message = 'Does not match.'
        } else {
            obj.message = '';
        }
        obj.result = ret;
        return (ret);
    }
    useList.password = function (value, obj) {
        console.log('useList.password(' + '######' + ');');
        var ret = false;
        if ((ret = useList.checkValue(value, obj)) == true) {
            useList.temppwd = new String(value);
        }
        return (ret);
    }
    useList.username = function (value, obj) {
        console.log('useList.username(' + value + ');');
        return (useList.checkValue(value, obj));
    }
    useList.alphanumeric = function (value, obj) {
        console.log('useList.text(' + value + ');');
        if (value <= 0) {
            return (true);
        } else {
            return (useList.checkValue(value, obj));
        }
    }
    useList.phone = function (value) {
        return (true);
    }
    useList.boolean = function (value, obj) {
        return (true);
    }
    useList.address = function (value, obj) {
        obj.message = 'testing 123';
        return (true);
    }
    useList.email = function (value) {
        return (true);
    }
    useList.Stylist = null;
    useList.inputstylist = function (value, obj) {
        if (typeof(useList.StylistUserId) === 'undefined') {
        } else {
            value = useList.StylistUserId;
            delete (useList.StylistUserId);
        }
        var entry = null;
        if (value.length <= 0) {} else
        if ((entry = RepeatObj.getEntry('stylist', 'UserId', value)) == null) {
        } else {
            useList.Stylist = entry;
            obj['value'] = entry.Name;
        }
        console.log('inputstylist(); value=[' + obj['value'] + ']');
    }
    useList.outputstylist = function (value, obj) {
        if (useList.Stylist == null) { } else {
            obj['value'] = useList.Stylist.UserId;
        }
    }
    useList.inputdate = function (value, obj) {
        try {
            //        var im = new moment(value);
            //        var am = new appmom(im.format());
            obj['value'] = new Date(value); // im.format()); // im.format('DD/MM/YYYY hh:mm a');
            console.log('obj[value]=[' + obj['value'].toDateString() + ']');
            obj.result = true;
            obj.message = '';
        } catch (e) {
        }
        return (true);
    }
    useList.outputdate = function (value, obj) {
        try {
            var im = new moment(value.toUTCString());
            var am = new appmom(im.format());
            obj['value'] = am.format();
            console.log('newvalue=[' + obj['newvalue'] + '][' + value + ']');
            obj.result = true;
            obj.message = '';
            return (true);
        } catch (e) {
        }
    }
    useList.checkAttr = function (obj, value, phasename) {
        var funcname = 'useList.checkAttr';
        var ret = true;
        var phase = obj[phasename];
        if (typeof (phase) === 'undefined') {
            console.log(funcname + '(); method not defined for phase=[' + phasename + ']');
            if (phasename === 'commit') {
                ret = true;
            } else {
                ret = false;
            }
        } else
        try {
            function executeFunctionByName(functionName, context, args) {
                var args = [].slice.call(arguments).splice(2);
                var namespaces = functionName.split(".");
                var func = namespaces.pop();
                for (var i = 0; i < namespaces.length; i++) {
                    context = context[namespaces[i]];
                }
                return context[func].apply(context, args);
            }
            if (useList.debug > 0) {
                console.log('run [' + phase + '(' + obj.name + ')]');
            }
            if ((ret = executeFunctionByName(phase, useList, value, obj)) == false) {
                obj.result = false;
            } else {
                ret = obj.result;
            }
            console.log(funcname + '(); Result: ' + JSON.stringify(obj));
        } catch (e) {
            obj.result = false;
            ret = false;
            obj.message = e.toString();
            console.log(e.toString())
        }
        return (ret);
    }
    useList.checkAttributes = function (fields, flag) {
        var funcname = 'useList.checkAttributes';
        var ret = true;
        if (fields == null) {
            ret = false;
            console.log(funcname + '(); fields null.');
        } else
        for (var i = 0; i < useList.objects.length; i++) {
            var obj = useList.objects[i];
            if (useList.debug > 1) {
                console.log('obj[' + i + ']=' + JSON.stringify(obj));
            }
            try {
                var value = fields[obj.name].value;
                if (value === obj.initial) {
                    value = '';
                }
                if (flag == false) {
                    var newobj = new Object();
                    newobj['key'] = obj.name
                    newobj['value'] = value;
                    useList.newvals[obj.name] = newobj;
                    useList.fields.push(newobj);
                    if (useList.debug > 2) {
                        console.log('useList.newvals.length=[' + useList.newvals.length + ']');
                    }
                }
                obj.message = 'has invalid value!';
                delete (obj.precheck);
                if (useList.checkAttr(
                    obj, value, (flag == true) ? 'commit' : 'validate') == false) {
                    ret = false; // latch false state; all must bCe true
                    console.log(funcname + '() failed obj=' + JSON.stringify(obj));
                }
                if (useList.debug < 2) { } else
                if (obj.type === 'password') {
                    console.log(obj.name + '=' + '{########}');
                } else {
                    console.log(obj.name + '=' + JSON.stringify(value));
                }
            } catch (e) {
                obj.result = false;
                ret = false;
                console.log(funcname + '(); exception ' + e.toString());
                obj.message = e.toString();
            }
            console.log(funcname + '() about to checkcomplete.');
            try {
                var callback = useList.checkcomplete;
                if (callback == null) { } else {
                    if ((ret = callback(flag, fields, ret)) == false) {
                        console.log(funcname + '(); callback returned false.');
                    }
                }
            } catch (e) {
                console.log(e.toString());
            }
        }
        return (ret);
    }
    useList.checkForm = function (success, failure, data) {
        var funcname = 'UserObj.useList.checkForm';
        var entry = (typeof (useList.entry) === 'undefined') ? new Object() : useList.entry;
        var filename = (typeof (entry['Method']) === 'undefined') ? '/server/' + useList.authkey : entry['Method'];
        console.log(funcname + '(); filename=[' + filename + ']');
        var nvs = useList.newvals;
        console.log('newvals=[' + nvs.length + ']');
        function get_cred(name, defcred, flag) {
            if (flag) {
                return ((typeof (nvs[name]) === 'undefined') ? defcred : nvs[name].value);
            } else {
                return (defcred);
            }
        }
        function setHeader() {
            var flag = filename.indexOf(useList.authkey) >= 0 ? true : false;
            var password = Controller.Password; // get_cred('Password', Controller.Password, flag);
            var username = Controller.UserId; // get_cred('Name', Controller.Username, flag)
            return (function setHeader(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            });
        }
        if (typeof(useList.updateObj) === 'undefined') {} else
        try {
            data.push(useList.updateObj);
            delete (useList.updateObj);
        } catch (e) {
            console.log(e);
        }
        if (useList.operation != null) {
            var obj = {
                key: 'operation',
                value: useList.operation
            }
            data.push(obj);
            useList.operation = null;
        }
        if (typeof (useList.sequence) === 'undefined') { } else {
            var obj = {
                key: 'sequence',
                value: useList.sequence
            }
            data.push(obj);
        }
        if (useList.debug < 1) { } else {
            console.log('data=' + JSON.stringify(data));
        }
        $.ajax({
            url: filename,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (json) {
                success(json);
            },
            error: function (jqxhr, textStatus, error) {
                var err = xhr.responseText;
                console.log("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                console.log("responseText: "+xhr.responseText);
                failure('Error[ ' + err + ']');
            },
            beforeSend: setHeader()
        });
        console.log(funcname + '(); Done!')
        return (true);
    }
    useList.forEachObject = function (callback) {
        for (var i = 0; i < useList.objects.length; i++) {
            callback(useList.objects[i]);
        }
    }
    useList.showResults = function () {
        var funcname = 'useList.showResults';
        useList.results = [];
        useList.forEachObject(function (obj) {
            try {
                if (obj.result == false) {
                    useList.results.push(obj);
                }
            } catch (e) {
                console.log(e.toString());
            }
        });
        if (useList.results.length <= 0) {
            console.log(funcname + '(); no results!');
        } else {
            useList.dialog.modal.style.display = "block";
        }
    }
    useList.clearResults = function () {
        useList.results = [];
        useList.forEachObject(function (obj) {
            try {
                obj.result = true;
            } catch (e) {
                console.log('useList.clearResults(); ' + e.toString());
            }
        });
    }
    useList.show = function (name, message) {
        function show() {
            var obj = new Object();
            obj.name = name;
            obj.message = message;
            return (function () {
                useList.results = [];
                useList.results.push(obj);
                useList.dialog.modal.style.display = "block";
                useList.update();
                console.log(obj.name + ': ' + obj.message);
            });
        }
        window.setTimeout(show(), 0);
    }
    useList.validate = function (input) {
        if (Controller.skipflag == true) {
            Controller.skipflag = false;
            return (false);
        }
        var ret = false;
        useList.newvals = new Array();
        useList.fields = new Array();
        var fields = document.forms[useList.panel + '-Form'];
        var callback = useList.cancel;
        if (callback != null) {
            useList.cancel = null;
            callback();
        } else
        if (useList.checkAttributes(fields, false) == true) {
            if ((ret = Controller.checkForm(
            function (json) {
                var response = new String(JSON.stringify(json));
                var result = response;
                if (typeof(json) === 'undefined') {} else
                if (typeof(json.Authentication) === 'undefined') {} else {
                    result = new String(json.Authentication == false ? response : json.Message);
                }
                console.log('Response: ' + response);
                if (result.indexOf('tatus') < 0 ||
                    result.indexOf('Success') < 0) {
                    useList.show('Denied', result);
                } else
                if ((ret = useList.checkAttributes(fields, true)) == false) {
                    useList.show('Failure', 'Unable to commit changes!');
                } else {
                    if (typeof (json.Authentication) === 'undefined') { } else
                    if (json.Authentication == false) {} else
                    try {
                        Controller.UserId = json.UserId;
                        Controller.UserObj = json;
                    } catch (e) {
                        alert('Cannot set UserId: ' + e.toString());
                    }
                    useList.initialize(useList.title, true);
                    var callback = Controller.Complete;
                    if (callback == null) {
                        Controller.CurrentObj.complete(json);
                    } else {
                        Controller.Complete = null;
                        callback();
                    }
                }
            },
            function (message) {
                try {
                    Controller.CurrentObj.changeState(obj, true);
                } catch (e) {}
                useList.show('Failure', message);
            }, useList.fields)) == false) {
                useList.show('Failure', 'Unable to check form or failure to process!');
            }
        } else {
            useList.showResults();
        }
        return (ret);
    }
}]);
