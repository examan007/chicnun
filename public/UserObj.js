﻿
var UserObj = angular.module('useApp', []);
UserObj.controller('UseController', ['$scope', function ($scope) {
    var useList = this;
    RepeatObj.useList = this;
    useList.debug = 1;
    useList.title = 'New';
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
    useList.data = null;
    useList.complete = null;
    useList.iregex = null;
    useList.operation = null;
    useList.dialog = new ModalObj('Account-Modal');
    useList.span = document.getElementsByClassName("close")[1];
    useList.span.onclick = function () {
        useList.dialog.modal.style.display = "none";
    }
    useList.initData = function () {
        if (useList.data == null) {
            console.log('useList.initData(); data=null');
        } else
        if (useList.objects == null) {
            console.log('useList.initData(); objects=null');
        } else
        for (var i = 0; i < useList.objects.length; i++) {
            var obj = useList.objects[i];
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
            for (var key in data) {
                console.log('key=[' + key.toString() + ']');
                if (obj.name === key) {
                    console.log('old value=[' + obj['value'] + ']');
                    if (useList.checkAttr(obj, data[key], 'input') == false) {
                        obj['value'] = data[key];
                    }
                    console.log('value=[' + obj['value'] + ']');
                    break;
                }
            }
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
            console.log('before triggerHandler');
            var element = angular.element('#UseUpdate');
//            console.log(JSON.stringify(element));
            element.triggerHandler('click');
            console.log('done triggerHandler');
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
            var id = 'Account-Input-' + entry.Focus;
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
            var id = '#Account-Input-' + name
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
        var objects = RepeatObj.getMap(mapname);
        console.log('useList.initialize(' + mapname + '); executing ...');
        if (objects == null) {
            console.log('Cannot find map name=[' + mapname + ']');
        } else {
            try {
                useList.results = [];
                useList.dialog.hide();
            } catch (e) {
                console.log(e.toString());
            }
            console.log('useList.initialize(' + objects.length + ');');
            useList.objects = objects;
            useList.clearObjects(flag);
            $scope.$apply(function () {
                useList.setActions(useList.entry);
                useList.title = mapname;
                useList.initData();
            });
            useList.setFocus(useList.entry);
            console.log('useList.initialize(' + mapname + ') [' + useList.objects.length + ']; done!');
            ret = true;
            var id = '';
            if (useList.actions.length <= 0) {
                console.log('No actions for [' + mapname + ']');
            } else
                try {
                    id = 'Account-Save-' + useList.actions[useList.actions.length - 1];
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
    useList.onKeyup = function (obj) {
        console.log('onKeyup() before testing $scope.value=[' + obj.value + ']');
        obj.precheck = true;
        if (useList.checkAttr(obj, obj.value, 'validate') == false) {
            if (obj.value.length > 0) {
                alert('Invalid character!');
            }
            obj.value = obj.value.substr(0, obj.value.length - 1);
        }
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
        const isValidCharacter = ch => {
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
        if (value.length <= 0) {
            obj.message = 'Empty value not allowed.'
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
        } else
        if (typeof (obj.minlength) === 'undefined') {
            ret = success(obj, value);
        } else
        if (value.length < parseInt(obj.minlength)) {
            obj.message = 'Not enough characters.';
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
                    console.log('useListcheckAttr() failed obj=' + JSON.stringify(obj));
                    ret = false; // latch false state; all must bCe true
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
                obj.message = e.toString();
            }
            console.log(funcname + '() about to checkcomplete.');
            var callback = useList.checkcomplete;
            if (callback == null) { } else {
                ret = callback(flag, fields, ret);
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
        if (useList.debug < 1) { } else
        try {
            console.log('data=' + JSON.stringify(data));
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
        $.ajax({
            url: filename,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (json) {
                success(json);
            },
            error: function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
//                alert("Request Failed: " + err + ' filename=[' + filename + ']');
                failure('Request Failed: ' + err + ' filename=[' + filename + ']');
            },
            beforeSend: setHeader()
        });
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
        var fields = document.forms['Account-Form'];
        var callback = useList.cancel;
        if (callback != null) {
            useList.cancel = null;
            callback();
        } else
        if (useList.checkAttributes(fields, false) == true) {
            if ((ret = Controller.checkForm(
            function (json) {
                var response = new String(JSON.stringify(json));
                var result = new String(json.Authentication == false ? response : json.Message);
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
