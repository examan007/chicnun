// JavaScript source code
function OS_Map(map) {
    this.map = map;
}
OS_Map.prototype.sort = function (key) {
    function getType(key) {
        if (key === 'start') {
            return ('datetime');
        } else {
            return ('default');
        }
    }
    this.map.sort(function (a, b) {
        var diff = -1;
        if (typeof(a[key]) === 'undefined'
            ||
            typeof(b[key]) === 'undefined') { } else
        if (getType(key) === 'datetime') {
            var amom = new moment(a[key]);
            var bmom = new moment(b[key]);
            diff = bmom.diff(amom);
        }
        return (diff);
    });
}
OS_Map.prototype.getActualRow = function (row) {
    var actual = this.map.length;
    if (row > this.map.length) {
        console.log('OS_Map.prototype.getActualRow(); row=[' + row + '] too high!');
    } else {
        var columns = this.map[row];
        actual = parseInt(columns[columns.length - 1]);
    }
    return (actual);
}
OS_Map.prototype.getLength = function () {
    return (this.map.length);
}
OS_Map.prototype.getEntry = function (key) {
    return (this.getEntryWithKey(key, null));
}
OS_Map.prototype.getEntryWithKey = function (key_in, keyname) {
    var key = new String(key_in);
    var entry = null;
    console.log('OS_Map.prototype.getEntry(); key=[' + key + ':' + keyname + ']');
    $.each(this.map, function (i, f) {
        var test = null;
        if (i === key) {
            entry = f;
            return (false);
        } else
        if (keyname != null) {
            test = f[keyname];
            test = test.toString();
            key = key.toString();
            console.log('test=[' + test + ']=[' + key + ']' + JSON.stringify(f));
        } else
        if (typeof (f.ObjectId) !== 'undefined') {
            test = f.ObjectId;
        } else
        if (typeof (f.Key) !== 'undefined') {
            test = f.Key;
        } else
        if (typeof (f.place_id) !== 'undefined') {
            test = f.place_id;
        }
        if (test == null) {} else
        if (test.length != key.length) {} else
        if (key.indexOf(test) == 0) {
            entry = f;
            return (false);
        }
    })
    return (entry);
}
OS_Map.prototype.getRow = function (row) {
    var names = null;
    if (row >= this.map.length) {
        console.log('OS_Map.prototype.getRow(); row=[' + row + '] too high max=[' + this.map.length + ']!');
    } else {
        names = this.map[row];
    }
    return (names);
}
OS_Map.prototype.getElement = function (row, column) {
    var element = null;
    if (empty(this.map)) {
        alert('OS_Map.prototype.getElement(); undefined map.');
    } else
        if (this.map.length > row) {
            var elements = this.map[row];
            if (elements.length >= column) {
                element = elements[column];
            } else {
                console.log('OS_Map.prototype.getElement(); NOT enough columns [' + column + ']');
            }
        } else {
            console.log('OS_Map.prototype.getElement(); NOT enough rows [' + row + ']');
        }
    return (element);
}
function ListObj() {
}
function ListDataObj(name) {
    var obj = new ListObj();
    obj.funcname = 'ListObj';
    obj.Name = name;
    obj.DataMap = null;
    obj.Cursor = 0;
    obj.MaxRows = 0;
    obj.DataKey = null;
    obj.Debug = 1;
    obj.ReadyFunc = null;
    obj.savecomplete = null;
    obj.initialize = function () {
        this.Rows = [];
        this.Lists = [];
        this.Header = null;
        this.ParentKey = null;
        this.ParentObj = null;
        this.Columns = null;
        this.Nodes = [];
        this.Selected = null;
        this.EnterCount = 0;
        this.Template = RepeatObj.getTemplate(this.Name);
        this.Original = RepeatObj.getOriginal(this.Name);
        this.SelectedColumn = null;
    }
    obj.initialize();
    return (obj)
}
ListObj.prototype.show = function () {
    return;
    console.log('ListObj.show()');
    console.log('Rows.length=[' + this.Rows.length + ']');
    if (this.Rows.length > 0) {
        console.log('Rows[0]=[' + JSON.stringify(this.Rows[0], RepeatObj.replacer) + ']');
    }
}
ListObj.prototype.clone = function (element) {
    return (element.cloneNode(true));
}
ListObj.prototype.find = function (id, node) {
    var result = null;
    var This = this;
    for(var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        var test = child.id;
        if (typeof(test) === 'undefined') { 
        } else
        if (test == null) {
        } else
        if (test === id) {
            result = child;
            break;
        } else
        if ((result = This.find(id, child)) != null) {
            break;
        }
    }
    return (result);
}
ListObj.prototype.getKey = function (entry) {
    if (typeof (entry.UniqueId) !== 'undefined') {
    } else {
        var header = null;
        if (this.ParentObj != null) {
            header = this.ParentObj.Header;
        } else {
//            header = this.Header;
        }
        if (header != null) {
            if (header.Rows.length > this.Rows.length) {
                entry.UniqueId = '' + header.Rows[this.Rows.length].Name;
            } else {
                header = null;
            }
        }
        if (header == null) {
            if (typeof (entry.ObjectId) !== 'undefined') {
                entry.UniqueId = entry.ObjectId;
            } else
            if (typeof (entry.place_id) !== 'undefined') {
                entry.UniqueId = entry.place_id;
            } else
            if (typeof (entry.Key) !== 'undefined') {
                entry.UniqueId = entry.Key;
            } else
            if (typeof (entry.SiteId) !== 'undefined') {
                entry.UniqueId = entry.SiteId;
            } else
            if (typeof (entry.UserId) !== 'undefined') {
                entry.UniqueId = entry.UserId;
            } else
            if (typeof (entry.Name) !== 'undefined') {
                entry.UniqueId = entry.Name;
            } else {
                entry.UniqueId = '' + this.Rows.length;
            }
        }
    }
//    this.show();
    return (entry.UniqueId);
}
ListObj.prototype.restore = function (force) {
    var funcname = 'ListObj.restore';
    var parent = null;
    if (this.Rows.length <= 0 && force == false) {
        console.log('' + funcname + '; empty [' + this.Name + ']');
    } else
    if (this.Template == null) {
        console.log('' + funcname + '; no template [' + this.Name + ']');
    } else {
        if ((parent = this.Template.parentNode) == null) {
            console.log(funcname + '; no parent; key=[' + this.DataKey + '] [' + this.Name + ']');
        } else {
            // console.log('' + funcname + '; remove template and clone original [' + this.Name + ']');
            parent.removeChild(this.Template);
            this.Template = this.Original.cloneNode(true);
            while (parent.childNodes.length > 0) {
                parent.removeChild(parent.childNodes[parent.childNodes.length-1]);
            }
            parent.appendChild(this.Template);
        }
    }
    this.Rows = [];
    this.Nodes = [];
}
ListObj.prototype.datetime = function (value, obj) {
    var ret = false;
    var mom = new moment(value);
    var str = mom.calendar(); //format('DD/MM/YYYY hh:mm a');
    if (str === 'Invalid date') {} else {
        obj.translation = str;
        ret = true;
    }
    return (ret);
},
ListObj.prototype.duration = function (value, obj) {
    var ret = false;
    var mom = new moment(value);
    var event = obj.entry;
    var str = mom.format();
    obj.translation = '';
    if (str === 'Invalid date') {
    } else
    if (typeof (event) === 'undefined') {
        obj.translation = 'no event';
    } else
    if (typeof (event.end) === 'undefined') {
        obj.translation = 'no event.end';
    } else {
        var start = new moment(event.start);
        if (start.format() === 'Invalid date') {
            obj.translation = 'Invalid:' + start.format();
        } else {
            var duration = Math.abs(start.diff(mom, 'hours', true));
            if (duration > 0) {
                obj.translation = '' + duration + ' hrs.';
            } else {
                obj.translation = 'No duration: ' + start.format();
            }
        }
        ret = true;
    }
    return (ret);
},
ListObj.prototype.translateByMethodName = function (method, value, entry) {
    var obj = new Object();
    obj.entry = entry;
    ret = value;
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
        if (executeFunctionByName(method, this, value, obj) == true) {
        }
        if (typeof (obj.translation) === 'undefined') {
        } else {
            ret = obj.translation;
        }
    } catch (e) {
        ret = value;
        console.log(e.toString())
    }
    return (ret);
}
ListObj.prototype.merge = function (entry, node) {
    var This = this;
    $.each(entry, function (i, v) {
//        console.log('[' + i + ']=[' + JSON.stringify(v, RepeatObj.replacer) + ']');
        var obj = null;
        var testid = This.Name + '-' + i;
        if ((obj = This.find(testid, node)) == null) {
        } else {
            if (This.ParentKey == null) {
                obj.id = testid + '-' + This.getKey(entry);
            } else {
                obj.id = testid + '-' + This.ParentKey + '-' + This.getKey(entry);
            }
            var elements = obj.childNodes;
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.nodeName === "#text") {
                    if (typeof (entry.DisplayName) !== 'undefined') {
                        element.textContent = entry.DisplayName;
                    } else {
                        element.textContent = v;
                    }
                    v.ThisElement = obj;
                }
            }
//            console.log('FOUND! id=[' + obj.id + '] text=[' + v + ']');
        }
    })
    return (node);
}
ListObj.prototype.filterAttr = function (attr, param) {
    var omit = false;
    if (attr === 'UniqueId') {
        omit = true;
    } else
    if (param == null) {
    } else
    if (typeof (param.DisplayStyle) === 'undefined') {
    } else
    if (param.DisplayStyle === 'Hidden') {
        omit = true;
    }
    return (omit);
}
ListObj.prototype.mergeRow = function (entry, node, invert) {
    var funcname = 'ListObj.mergeRow';
    var This = this;
    var map = [];
    var data = Map;
    data.map = map;
    function getValue(name, value, entry) {
        var ret = value;
        var parm = ParamObj.findParameter(name);
        if (parm == null) {
        } else
        if (typeof (parm.Translate) === 'undefined') {
        } else {
            ret = This.translateByMethodName(parm.Translate, value, entry);
        }
        return (ret);
    }
    if (this.Columns != null) {
        for (var x = 0; x < this.Columns.length; x++) {
            var i = this.Columns[x];
            var val = getValue(i, entry[i], entry);
            var obj = new Object;
            obj.Name = val;
            obj.Value = val;
            map.push(obj);
        }
    } else
    $.each(entry, function (i, v) {
        if (This.filterAttr(i, ParamObj.findParameter(i)) == true) {
        } else {
            var val = getValue(i, v, entry);
            var obj = new Object;
            obj.Name = val;
            obj.Value = val;
            map.push(obj);
        }
    });
    var template = null;
    var id = '' + this.Name + '-Option';
    if ((template = this.find(id, node)) == null) {
        if (id.indexOf('Item-Option') < 0) {
            alert('' + funcname + '(); cannot find [' + id + ']');
        }
    } else {
//        console.log('' + funcname + '(); FOUND [' + id + ']');
        this.Template = template;
        //        this.restore(true);
        if (invert === 'true') {
            map.reverse();
        }
        this.processData(data);
        this.Template = RepeatObj.getTemplate(this.Name);
    }
    return (this);
}
ListObj.prototype.getRow = function (entry, idext, invert) {
    var list = null;
    if ((list = new ListDataObj('' + this.Name + idext)) == null) {
    } else
    if (list.Template == null) {
    } else {
        var map = new Array();
        var data = new Object();
        data.map = map;
        var n = 0;
        var thisentry = entry;
        var columns = null;
        function process(i, v, param) {
            var obj = new Object;
            if (idext === '-Header') {
                obj.Name = i;
                if (param == null) {} else
                if (typeof (param.DisplayName) !== 'undefined') {
                    obj.DisplayName = param.DisplayName;
                }
            } else {
                obj.Name = v;
            }
            map.push(obj);
        }
        var done = false;
        try {
            var select = '';
            if (idext === '-Header') {
                var selection = RepeatObj.Data['Selection'].DataMap;
                var selected = selection.getEntry(Controller.Filter);
                var select = selected['Columns'];
                console.log('Get Columns [' + Controller.Filter + ']' +
                    select + JSON.stringify(entry));
            }
            var cols = null;
            if ((cols = select.split('|')) != null && cols.length > 1) {
                this.Columns = cols;
            }
            if (this.Columns != null) {
                for (var x = 0; x < this.Columns.length; x++) {
                    var i = this.Columns[x];
                    var v = entry[i];
                    process(i, v, ParamObj.findParameter(i));
                }
            }
            done = true;
        } catch (e) { }
        if (done) {} else
        $.each(entry, function (i, v) {
            var param = null;
            if (list.filterAttr(i, (param = ParamObj.findParameter(i))) == true) {
            } else {
                process(i, v, param);
            }
        });
        if (invert === 'true') {
            map.reverse();
        }
        if (idext !== '-Header') {
            list.ParentObj = this;
            list.ParentKey = this.getKey(entry);
        }
        list.Columns = this.Columns;
        list.processData(data);
    }
    return (list);
}
ListObj.prototype.getHeader = function (entry, invert) {
    if (this.Header != null) {
    } else 
    if ((this.Header = this.getRow(entry, '-Header', invert)) == null) {
    } else {
    }
    return (this.Header);
}
ListObj.prototype.addEntry = function (entry) {
    var funcname = 'ListObj.addEntry';
    var newnode = null;
    var parent = null;
    var newlist = null;
    var invert = 'false';
    if ((value = ParamObj.getValue(
    'ScopeInvertColumns', 'ParamValues')) != null) {
        invert = parseInt(value.split('|')[0]);
    }
    var filter = ''
    if (typeof (val = entry['Filter']) === 'undefined') { } else {
        filter = val;
    }
//    console.log(funcname + '(); executing ... Name=[' + this.Name + ']');

    if (filter === 'hidden') {} else
    if (this.Template == null) {
        console.log('' + funcname + '; unable to find template [' + this.Name + ']');
    } else
    if ((this.Header = this.getHeader(entry, invert)) == null) {
        console.log('' + funcname + '; unable to get header [' + this.Name + ']');
    } else
    if ((newlist = this.getRow(entry, '-Item', 'false')) == null) {
        console.log('' + funcname + '; uanble to getRow [' + this.Name + ']');
    } else
    if (0) { //(parent = this.Template.parentNode) == null) {
        console.log('' + funcname + '; no parent [' + this.Name + ']');
    } else 
    if ((newnode = this.clone(this.Original)) == null) {
        console.log('' + funcname + '; unable to clone [' + this.Name + ']');
    } else
    if (newlist.mergeRow(entry, newnode, invert) == null) {
        console.log('' + funcname + '; unable to merge NewRow [' + this.Name + ']');
    } else
    if (this.merge(entry, newnode) == null) {
        console.log('' + funcname + '; unable to merge [' + this.Name + ']');
    } else {
        if (this.ParentKey == null) {
            newnode.id = newnode.id + '-' + this.getKey(entry);
        } else {
            newnode.id = newnode.id + '-' + this.ParentKey + '-' + this.getKey(entry);
        }
        newnode['filter'] = filter;
        this.Rows.push(entry);
        this.Lists.push(newlist);
        var classname = newnode.className;
        if (typeof (classname) === 'undefined') {
            console.log('' + funcname + '; unable to find class [' + this.Name + ']');
        } else
        if (classname === '' + this.Name + '-Template') {
            var operation = '';
            if (typeof (operation = entry['Operation']) === 'undefined') {
                operation = '';
            }
            if (this.ParentKey == null) {
                newnode.className = '' + this.Name + '-Instance' + operation;
            } else {
                newnode.className = '' + this.Name + '-Instance' +
                    ' ' + this.Name + '-Instance-' +
                    this.getKey(entry) + operation;
            }
        }
        var valclass = '' + this.Name + '-Value';
        var elements = newnode.getElementsByClassName(valclass + '-Template');
        for (var n = 0; n < elements.length; n++) {
            elements[n].className = valclass + '-' + this.getKey(entry);
        }
        this.Nodes.push(newnode);
        if ((parent = this.Template.parentNode) != null) {
            parent.appendChild(newnode);
        }
//        console.log(funcname + '(); SUCESS, newnode added!');
    }
//    console.log(funcname + '(); done!');
}
ListObj.prototype.processData = function (data) {
    var funcname = 'ListObj.prototype.processData';
    if (this.EnterCount > 3) { return; }
    this.EnterCount++;
//    this.restore(false);
    if (data != null) {
        var jsonmap = JSON.stringify(data.map, RepeatObj.replacer);
//        console.log('' + funcname + '; jasonmap');
//        console.log(jsonmap);
        this.DataMap = new OS_Map(eval(jsonmap));
        try {
            this.DataMap.sort('start');
        } catch (e) {
            console.log(e.toString());
        }
    }
    if (this.DataMap == null) {
        console.log('' + funcname + '; Invalid Data!');
    } else
    if (this.DataMap.map == null) {
        console.log('' + funcname + '; Invalid Data map!');
    } else
    if (this.DataMap.map.length <= 0) {
        console.log('' + funcname + '; Data map length zero!');
    } else {
        if (this.Debug > 1) {
            console.log('' + funcname + '; executing!');
        }
        var This = this;
        This.restore(true);
        var count = 0;
        for (var i = 0; i < this.DataMap.map.length; i++) {
            var f = this.DataMap.map[i];
            if (count >= This.Cursor) {
                if (This.MaxRows == 0 || This.Rows.length < This.MaxRows) {
                    This.addEntry(f);
                    //                    console.log('' + JSON.stringify(f, RepeatObj.replacer));
                } else {
                    break;
                }
            }
            count++;
        }
        while (This.Rows.length < This.MaxRows) {
            var blank = new Object;
            for (var n = 0; n < This.Header.Rows.length; n++) {
                var row = This.Header.Rows[n];
                blank[row.Name] = '-';
            }
            This.addEntry(blank);
        }
        if (This.ParentObj == null && typeof(ScrollGovernor) !== 'undefined') {
            ScrollGovernor.total = this.DataMap.map.length;
            if (data != null) {
                RepeatObj.scroll();
            }
        }
    }
    this.EnterCount--;
}
ListObj.prototype.handleFailure = function (err) {
    console.log("Request Failed: [" + err + ']');
}
function setHeader() {
    var username = 0;
    var password = 'nginx';
    try {
        username = Controller.UserId; 
        password = Controller.Password;
    } catch (e) {}
    return (function (xhr) {
        xhr.setRequestHeader(
            "Authorization", "Basic " + btoa(username + ":" + password));
});
}
ListObj.prototype.getData = function (jsonfilename) {
    console.log('ListObj.prototype.getData(); filename=[' + jsonfilename + ']');
    function success(list) {
        var This = list;
        return (function (json) {
            This.processData(json);
            if (This.ReadyFunc != null) {
                console.log('This.ReadyFunc=[TRUE] filename=[' + jsonfilename + ']');
                This.ReadyFunc(This);
            } else {
                console.log('This.ReadyFunc=[FALSE]');
            }
        });
    }
    function failure(list) {
        var This = list;
        return (function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                This.handleFailure(err);
        });
    }
    $.ajax({
        url: jsonfilename + '?nocache=' + (new Date()).getTime(),
        type: 'GET',
        dataType: 'json',
        success: success(this),
        error: failure(this),
        beforeSend: setHeader()
    });
}
ListObj.prototype.sendData = function (filename, data, success, failure) {
    if (this.Debug < 1) { } else
    try {
        console.log('data=' + JSON.stringify(data));
    } catch (e) {
        console.log(e);
    }
    $.ajax({
        url: filename,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        success: success,
        error: function (xhr, textStatus, error) {
            var err = eval("(" + xhr.responseText + ")");
            console.log('xhr=' + JSON.stringify(err));
            failure('Error[ ' + JSON.stringify(err) + ']');
        },
        beforeSend: setHeader()
    });
}

function SelectionOption(title, name, filter) {
    this.title = title;
    this.name = name;
    this.filter = filer;
}

var RepeatObj = {
    Data: [],
    Scope: null,
    todoList: null,
    Originals: [],
    getTemplate: function (name) {
        var funcname = 'getTemplate';
        if ((temp = document.getElementById(name + '-Option')) == null) {
//            alert(funcname + '(); unable to find template [' + name + ']');
        } else 
        if (typeof (this.Originals[name]) === 'undefined') {
            this.Originals[name] = temp.cloneNode(true);
            console.log(funcname + '(); clone original name=[' + name + ']');
        }
        return (temp);
    },
    getOriginal: function (name) {
        var orig = this.Originals[name];
        if (typeof (orig) === 'undefined') {
            orig = null;
        }
        return (orig);
    },
    replacer: function (key, value) {
        return value;
    },
    sortMap: function (key, attr) {
        var map = null;
        try {
            map = this.Data[key].DataMap.map;
            map.sort( function (a, b) {
                return (parseInt(a[attr])-parseInt(b[attr]));
            });
        } catch (e) {
            console.log(e);
        }
        return (map);
    },
    getMap: function (key) {
        var map = null;
        try {
            map = this.Data[key].DataMap.map;
        } catch (e) {
            console.log(e);
        }
        return (map);
    },
    getDataMap: function (key) {
        var map = null;
        try {
            map = this.Data[key].DataMap;
        } catch (e) {
            console.log(e);
        }
        return (map);
    },
    findEntry: function (key) {
        var funcname = 'RepeatObj.findEntry';
        var entry = null;
        if (this.Scope == null) {
            console.log(funcname + '(); Scope is null!');
        } else
        if (this.Scope.DataMap == null) {
            console.log(funcname + '(); Scope.Map is null!');
        } else {
            entry = this.Scope.DataMap.getEntry(key);
        }
        return (entry);
    },
    getEntry: function (dropdown, key, value) {
        var funcname = 'RepeatObj.getEntry';
        var map = null;
        var entry = null;
        try {
            if ((map = this.Data[dropdown].DataMap) == null) {
                console.log(funcname + '(); Map NOT found; dropdown=[' + dropdown + '] key value=[' + value + ']');
            } else
            if ((entry = map.getEntryWithKey(value, key)) == null) {
                console.log(funcname + '(); Entry NOT found; dropdown=[' + dropdown + '] key value=[' + value + ']');
            }
        } catch (e) {
            console.log(funcname + '(); Exception; dropdown=[' + dropdown + '] key value=[' + value + ']');
            console.log(funcname + '();' + e.toString());
        }
        return (entry);
    },
    getMaxRows: function (rowheight) {
        var maxrows;
        maxrows = Math.trunc(($(window).height() - 150) / rowheight);
        AutoZoomObj.maxRows = maxrows;
        return (maxrows);
    },
    addListObj: function (listobj, tempid, jsonfilename, readyfunc) {
        var funcname = 'RepeatObj.addList';
        if (listobj == null) {
            alert('Cannot allocate ListObj ...!')
        } else {
            function complete(listobj) {
                var list = listobj;
                var ready = readyfunc;
                return (function() {
                    console.log('addListObj.complete(); list=[' + list.DataKey + '] name=[' + list.Name + ']');
                    RepeatObj.Scope = list;
                    if (ready != null) {
                        ready();
                    }
                    list.processData(null);
                    ScrollGovernor.registerScroll('Scope-Table-Body', list.DataKey, list);
                    RepeatObj.scroll();
//                    ScrollGovernor.executeScrollElements();
                })
            };
            var datakey = listobj.DataKey;
            var existing = RepeatObj.Data[datakey];
            ScrollGovernor.stopCurrent();
            if (typeof (existing) === 'undefined') {
                if (tempid.split('-')[0] === 'Scope') {
                    if ((value = ParamObj.getValue(
                        'ScopeTableRows', 'ParamValues')) != null) {
                        listobj.MaxRows = parseInt(value.split('|')[0]);
                        console.log('maxrows=[' + listobj.MaxRows + ']');
                    }
                }
                listobj.ReadyFunc = complete(listobj);
                RepeatObj.Data[datakey] = listobj;
                listobj.getData(jsonfilename);
            } else {
                try {
                    existing.initialize();
                    console.log(funcname + '(); before complete()');
                    existing.ReadyFunc = listobj.ReadyFunc;
                    listobj = existing;
                    complete(listobj)();
                } catch (e) {
                    console.log(e.toString());
                }
            }
        }
    },
    getDataKey: function (jsonfilename) {
        var funcname = 'RepeatObj.getDataKey()';
        var key = 'key';
        try {
            var val;
            var start = (val = jsonfilename.lastIndexOf('/')) >= 0 ? val + 1 : 0;
            var end = (val = jsonfilename.indexOf('.json')) >= 0 ? val : start;
            console.log(funcname + '(); using filename=[' + jsonfilename + '] ' + start + ':' + end);
            key = jsonfilename.substring(start, end);
        } catch (e) {
            alert(funcname + e.toString());
        }
        return (key);
    },
    addList: function (tempid, jsonfilename, readyfunc) {
        var funcname = 'RepeatObj.addList()';
        var key = RepeatObj.getDataKey(jsonfilename);
        var listobj = null;
        if ((listobj = new ListDataObj(tempid)) == null) {
            console.log(funcname + '(); Error in ' + funcname + '; unable to create ListObj');
        } else {
            listobj.DataKey = key;
            console.log(funcname + '(); NEW [' + tempid + '] ListObj[' + listobj.DataKey + ']');
        }
        this.addListObj(listobj, tempid, jsonfilename, readyfunc);
        return (listobj);
    },
    writeElementCount: function () {
        var funcname = 'Controller.writeElementCount()';
        var testid = 'Scope-Table-Count';
        var element = document.getElementById(testid);
        if (element == null) {
            console.log('' + funcname + '(); no id=[' + testid + ']');
        } else {
            if (this.Debug > 1) {
                console.log('' + funcname + '(); total=[' + ScrollGovernor.total + ']');
            }
            var scope = this.Scope;
            var cursor = 0;
            if (scope == null) {
            } else
            if (typeof (scope) === 'undefined') {
            } else
            if (scope.Cursor == null) {
            } else
            if (typeof (scope.Cursor) === 'undefined') {
            } else {
                cursor = scope.Cursor;
            }
            cursor++;
            element.childNodes[0].textContent =
            '' + cursor + ' of ' + ScrollGovernor.total;
        //                parseFloat(Math.round(AutoZoomObj.zoomLev * 100) / 100).toFixed(4);
        }
    },
    scroll: function () {
        if (this.Debug > 1) {
            console.log('RepeatObj.scroll()');
        }
        this.writeElementCount();
        scrollController(document.getElementById('Scope-Table-Body'));
    },
    SaveScrollTop: 0,
    checkScroll: function () {
        try {
            this.SaveScrollTop = $("#Scope-Table-Body").scrollTop();
        } catch (e) {}
    },
    isScroll: function () {
        var ret = false;
        try {
            test = $("#Scope-Table-Body").scrollTop();
            if (Math.abs(parseInt(test)-parseInt(this.SaveScrollTop)) > 5) {
                ret = true;
                this.SaveScrollTop = test;
            }
        } catch (e) { }
        return (ret);
    }
}
function ZonesListObj(tempid, getdatafunc, addentryfunc) {
    var that = new ListDataObj(tempid);
    that.getData = getdatafunc;
    that.addEntry = addentryfunc;
    return that;
}
exports.id = 'public/RepeatObj.js';
exports.addList = function (keyname, datafile, readyfunc, getdatafunc, addentryfunc) {
    RepeatObj.addListObj(
        new ZonesListObj(keyname, getdatafunc, addentryfunc),
        keyname, datafile, readyfunc);
}
