var Controller = {
    ClassObj: 'Controller',
    Debug: 0,
    LastSelect: null,
    CurrentState: 'Selection',
    LastObject: null,
    SaveStyles: [],
    Filter: 'Stylist',
    CurrentEntry: null,
    UserId: 0,
    Username: 'nginx',
    Password: 'nginx',
    Nobody: 'nginx',
    UserObj: null,
    ActionEntry: null,
    DataDir: '/data/',
    PrivateDir: '/private/',
    CurrentObj: new ControlObj(),
    Controls: [],
    Complete: null,
    CompletePhase: null,
    StylistUserId: "",
    StylistUser: null,
    checkForm: function (success, failure, data) {
        var funcname = this.ClassObj + '.checkForm';
        var ret = false;
        try {
            ret = this.CurrentObj.checkForm(success, failure, data);
        } catch (e) {
            console.log(funcname + e.toString());
        }
        return (ret);
    },
    editEvent: function (event, callback) {
        var funcname = this.ClassObj + '.editEvent';
        if (typeof (event) === 'undefined') {
            alert('event undefined!');
        }
        console.log(funcname + '()=' + JSON.stringify(event));
        Controller.CurrentEvent = JSON.parse(JSON.stringify(event));
        var obj = {
            complete: callback,
            event: event,
            id: 'Selected-Option-Event',
            callback: function (obj) {
            }
        }
//        RepeatObj.useList.addData(obj.event);
        Controller.select(obj);
        Controller.changeState(obj, true);
    },
    authenticate: function (callback) {
        var element = new Object();
        element.id = 'Toolbar-Option-Account-Login';
        this.Complete = callback;
        Controller.SelectedButton = element;
        Controller.select(element);
    },
    createEvent: function (callback) {
        Controller.CurrentObj.action(callback);
    },
    scopeEvent: function () {
        $('.mappieces').each(function(){
            var p = $(this).offset();
            var w = $(this).width();
            var h = $(this).height();
            var $invisibleElement = $('div').addClass('invisible-style').css({
                position: "absolute",
                top: p.top,
                left: p.left,
                width: w,
                height: h,
                "z-index": 400 //on top of everything
            }).appendTo('body');
            $invisibleElement.hover( function() {
                console.log('scopeEvent(); 0 ' + stringify(this));
            }, function () {
                console.log('scopeEvent(); 1 ' + stringify(this));
            }); //do stuff
        });
    },
    replacer: function (key, value) {
        return value;
    },
    reload: function () {
        if (this.CurrentState === 'Selection') {
            location.reload(true);
        }
    },
    showState: function (object) {
        var jsonobj = JSON.stringify(object, Controller.replacer);
        console.log(jsonobj);
    },
    setSection: function(sectionname, hideflag) {
        var element = null;
        if ((element = document.getElementById(sectionname)) == null) {
            console.log('Section=[' + sectionname + '] NOT found!');
        } else
        if (hideflag === true) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    },
    showSection: function(sectionname) {
        Controller.setSection(sectionname, false);
    },
    hideSection: function (sectionname) {
        Controller.setSection(sectionname, true);
    },
    setClassName: function (classname) {
        var element = document.getElementById('DomainName');
        if (element == null) {
            console.log('setDomainHeight() unable to find DomainName');
        } else {
            element.className = classname;
        }
    },
    getTest: function (obj) {
        var funcname = 'Controller.getTest';
        var list = null;
        var test = null;
        if (typeof (obj.id) === 'undefined') {
            console.log('' + funcname + '(); obj.id undefined!');
        } else
        if ((list = obj.id.split('-')) == null) {
            console.log('' + funcname + '(); id cannot parse!');
        } else
        if (list.length < 4) {
            console.log('' + funcname + '(); id too short!');
        } else
        if ((test = list[3]) == null) {
            console.log('' + funcname + '(); id missing dimension!');
        } else
        for (var i = 4; i < (list.length-1); i++) {
            test += '-' + list[i];
        }
        return (test);
    },
    getEntry: function (obj) {
        var funcname = 'Controller.getEntry';
        var entry = null;
        var test = null;
        try {
            if (RepeatObj.Scope.Selected == null) {
                console.log('' + funcname + '(); nothing selected!');
            } else {
                entry = this.ActionEntry;
                console.log('' + funcname + '(); entry=' + JSON.stringify(entry));
            }
        } catch (e) {
 //           console.log(e.toString());
        }
        if (entry != null) {
        } else
        if ((test = Controller.getTest(obj)) == null) {
            console.log('' + funcname + '(); cannot create test!');
        } else
        if ((entry = RepeatObj.findEntry(test)) == null) {
            console.log( '' + funcname + '(); cannot find key!' + JSON.stringify(test));
        }
        return (entry);
    },
    getKey: function (obj, name, entry) {
        var funcname = 'Controller.getKey';
        var key = null;
        if (typeof(entry) === 'undefined' || entry == null) {
            if ((entry = this.getEntry(obj)) == null) {
            }
        }
        if (typeof (entry[name]) === 'undefined') {
            console.log('' + funcname + '(); UniqueId undefined!');
        } else {
            key = entry[name];
            var label = null;
            if ((label = new String(entry['GivenName'])).toString() !== 'undefined') { } else
                if ((label = new String(entry['name'])).toString() !== 'undefined') { } else {
                label = new String('unknown');
            }
            console.log('' + 'entry=[' + JSON.stringify(entry) + ']');
            GoogleAPI.LabelName = label.toString();
        }
        return (key);
    },
    restoreStyle: function (id) {
        var element = null;
        var save = null;
        if ((element = document.getElementById(id)) == null) {
        } else
        if (typeof(this.SaveStyles[id]) === 'undefined') {
        } else {
            var save = JSON.parse(this.SaveStyles[id]);
//            console.log('restoreStyle(); style=[' + save + ']');
            element.setAttribute('style', save);
        }
    },
    saveStyle: function (id, newstlye) {
        var element = null;
        var style = null;
        if ((element = document.getElementById(id)) == null) {
            alert('Cannot find [' + id + ']');
        } else {
            if (typeof(this.SaveStyles[id]) !== 'undefined') {
            } else
            if ((style = element.getAttribute('style')) != null) {
                var save = JSON.stringify(element.style, Controller.replacer);
//                console.log('saveStyle(); style=[' + save + ']');
                this.SaveStyles[id] = save;
            }
            element.setAttribute('style', newstlye);
        }
    },
    addMarkers: function () {
        var funcname = 'Controller.addMarkers';
        console.log(funcname + '(); executing ...');
        return;
        $.each(RepeatObj.Scope.DataMap.map, function (i, f) {
            if (this.Debug > 1) {
                console.log(funcname + '(); map[' + i + ']=[' +
                    JSON.stringify(f) + ']');
            }
            try {
                GoogleAPI.LabelName = f['name'].toString();
                GoogleAPI.addMarker(f['lat'], f['lng'], f);
            } catch (e) {
                console.log(funcname + '(); exception ...');
                console.log(e);
            }
        });
    },

    setControl: function (name) {
        var funcname = this.ClassObj + '.setControl';
        var existing = Controller.Controls[name];
        console.log(funcname + '(); name=[' + name + ']');
        if (typeof(existing) === 'undefined') {
            if (name === 'Search') {
                Controller.CurrentObj = new SearchObj();
            } else
            if (name === 'Booking') {
                Controller.CurrentObj = new BookingObj();
            } else
            if (name === 'Account') {
                Controller.CurrentObj = new AccountObj();
            } else {
                Controller.CurrentObj = new ControlObj();
            }
            Controller.Controls[name] = Controller.CurrentObj;
        } else {
            Controller.CurrentObj = existing;
        }
        return (Controller.CurrentObj);
    },
    initializeUser: function () {
        console.log('initializeUser');
        var booking = Controller.Controls['Booking'];
        if (typeof (booking) === 'undefined') { } else
        try {
            booking.Calendar.this_initialize();
        } catch (e) {
            console.log('initializeUser()=' + e.toString());
        }
    },
    setState: function (obj, newstate) {
        var funcname = 'Controller.setState';
        console.log(funcname + '(); new=[' + newstate + '] current=[' + this.CurrentState + ']');
        console.log('obj=' + JSON.stringify(obj));
        if (newstate === this.CurrentState) {
            console.log(funcname + '(); NO State change!');
            Controller.options(obj, false);
        } else
            if (
            newstate === 'Search'
            ||
            newstate === 'Booking'
            ||
            newstate === 'Account'
        ) {
            var oldobj = Controller.CurrentObj;
            Controller.CurrentObj = this.setControl(newstate);
            Controller.CurrentObj.setClass();
            oldobj.hide();
            Controller.CurrentState = Controller.CurrentObj.getLastState();
            Controller.CurrentObj.show();
            Controller.options(obj, false);
        }
        return (Controller.CurrentObj.setState(obj, newstate));

    },
    changeState: function (obj, nextflag) {
        var funcname = 'Controller.changeState';
        var oldstate = this.CurrentState;
        var changeflag = false;
        if (Controller.Debug > 0) {
            console.log('' + funcname + '(); state=[' + oldstate + '] next=[' + changeflag ? 'true' : 'false' + ']');
            console.log(JSON.stringify(this));
        }
        return (Controller.CurrentObj.changeState(obj, nextflag));
    },
    getId: function (obj) {
        console.log(obj.toString());
        var id = obj.id.split('-')[0];
        console.log('nodeName=[' + obj.nodeName + '] id=[' + obj.id + ']');
        console.log('click(); state=[' + Controller.CurrentState + ']');
        return (id);
    },
    next: function (obj, deviceflag) {
        var id = Controller.getId(obj);
        if (deviceflag === 'true' && AutoZoomObj.isDevice === true) {
            console.log('isDevice=true');
        } else {
            Controller.changeState(obj, true);
        }
    },
    prev: function (obj) {
        var id = Controller.getId(obj);
        Controller.changeState(obj, false);
    },
    setNewClassName: function (id, classname, newclass) {
        var funcname = 'Controller.setNewClassNames';
        if ((element = document.getElementById(id)) == null) {
            console.log(funcname + '(); cannot find id [' + id + ']');
        } else
        if ((buttons = element.getElementsByClassName(classname)) == null) {
            console.log(funcname + '(); cannot find class [' + classname + ']');
        } else
        if (buttons.length <= 0) {
            console.log(funcname + '(); not enough [' + classname + '.button]');
        } else {
            buttons[0].className = '' + newclass;
        }
    },
    SelectedButton: null,
    getValue: function (entry, name) {
        var value = null;
        try {
            value = entry[name];
        } catch (e) {
            console.log(e);
        }
        return (value);
    },
    skipflag: false,
    select: function (obj) {
        var funcname = 'Controller.select';
        var id = obj.id;
        var args = id.split('-');
        console.log(funcname + '(); nodeName=[' + obj.nodeName + '] id=[' + id + ']');
        Application.select(obj);
        if (typeof (obj.selected) === 'undefined') { } else
        if (obj.selected == true) {
            this.SelectedButton = obj;
        }
        var phase = args[0];
        if (phase === 'Account') {
            console.log('Account request=[' + obj.toString() + ']');
            Controller.CurrentObj.submit(obj);
            if (args.length < 3) {} else
            if (args[2] === 'New') {
                Controller.skipflag = true;
                Controller.select({
                    id: 'Selected-Option-New',
                    selected: true
                });
            }
        } else
        if (phase === 'Dropdown') {
            if (args.length < 3) {
            } else {
                Controller.select({
                    id: 'Toolbar-Option-' + Controller.CurrentOption + '-' + args[2],
                    selected: true
                });
            }
        } else
        if (phase === 'Selected') {
            var option = 'unknown';
            try {
                if (args.length >= 3) {
                    option = args[2];
                } else {
                    option = Controller.CurrentObj.State;
                }
            } catch (e) { }
            try {
                console.log(funcname + '(); obj.id=[' + obj.id + '] option=[' + option + ']');
                var entry = null;
                if ((entry = RepeatObj.getEntry('Dropdown', 'Key', option)) == null) {
                    // alert('option=[' + option + '] NOT found in drop down list.')
                } else {
                    console.log(funcname + JSON.stringify(entry));
                    console.log('Current control=[' + Controller.CurrentObj.Control + ']');
                    Controller.CurrentObj.option(entry, option);
                    console.log('RepeatObj.uselist.entry=' + JSON.stringify(RepeatObj.useList.entry));
                }
            } catch (e) {
                console.log(JSON.stringify(e));
            }
        } else
        if (phase === 'Selection') {
            var table = null;
            var tid = id.replace('-Title-', '-Table-');
            if ((table = document.getElementById(tid)) == null) {
                console.log('[' + tid + '] not found!');
            } else {
                if (Controller.LastSelect != null) {
                    Controller.LastSelect.style.visibility = 'hidden';
                }
                table.style.visibility = 'visible';
                Controller.LastSelect = table;
            }
        } else
        if (phase === 'Scope') {
            //            console.log('Scope;[1]=[' + args[1] + '] [3]=[' + args[3] + ']');
            if (args[1] == 'Option') {
                Controller.changeState(obj, true);
            } else
            if (
                args[1] == 'Item'
                &&
                args[2] == 'Value'
                ) {
                console.log('Get map for userid=[' + args[3] + ']');
                Controller.changeState(obj, true);
            }
        } else
        if (phase === 'Toolbar') {
            if (obj === this.SelectedButton || AutoZoomObj.isDevice == false) {
                if (RepeatObj.Scope != null) {
                    RepeatObj.Scope.restore(true);
                    RepeatObj.Scope = null;
                }
                if (args[1] == 'Option') {
                    var control = this.CurrentObj == null ? '' : this.CurrentObj.Control
                    var oldid = '' + args[0] + '-' + args[1] + '-' + control;
                    var newid = '' + args[0] + '-' + args[1] + '-' + args[2];
                    console.log('oldid=[' + oldid + ' ] newid=[' + id + ']');
                    console.log('CurrentObj.Control=[' + control + '] new=[' + args[2] + ']');
                    if (oldid !== newid) {
                        var classname = 'Toolbar-Button';
                        this.setNewClassName(oldid, classname + '-Selected', classname);
                        this.setNewClassName(newid, classname, classname + '-Selected');
                    }
                    var element = new Object();
                    element.id = 'Toobar-Button-' + args[2];
                    if (this.setState(element, args[2]) == true) {
                        if (Controller.CurrentObj != null) {
                            console.log(funcname + '() calling postsetState(), args.length=[' + args.length + ']');
                            var newstate = args.length >= 4 ? args[3] : null;
                            Controller.CurrentObj.postsetState(newstate);
                        }
                        console.log(funcname + '() show options');
                        this.options(obj, false);
                    }
                }
            } else {
                this.SelectedButton = obj;
            }
        }
        if (typeof (obj.editpended) === 'undefined') { } else {
            obj.editpended();
            delete (obj.editpended);
        }
        if (typeof (obj.executeselect) === 'undefined') { } else {
            obj.executeselect();
            delete (obj.executeselect);
        }
        if (typeof (obj.executeoption) === 'undefined') { } else {
            obj.executeoption();
            delete (obj.executeoption);
        }
        if (typeof (obj.savecomplete) === 'undefined') { } else {
            obj.savecomplete();
            delete (obj.savecomplete);
        }
        var editevent = Controller.editevent;
        if (typeof (editevent) === 'undefined') { } else {
            delete (Controller.editevent);
            editevent();
        }
        CheckSizeZoom();
    },
    CurrentOption: '',
    options: function (obj, flag) {
        var funcname = 'Controller.options';
        var elements = null;
        var styleon = 'display:block';
        var styleoff = 'display:none';
        var value = flag == true ?  styleon: styleoff;
        var args = obj.id.split('-');
        var suffix = '';
        if (flag == true) {
            var option = args[2];
            if (args[0] === 'Dropdown') {
                option = this.CurrentOption;
            }
            if (option !== this.CurrentOption) {
                this.options(obj, false);
            }
            this.CurrentOption = option;
        }
        if (this.Debug > 1) {
            console.log(funcname + '(); id=[' + obj.id + '] flag=[' + (flag ? 'true' : 'false') + ']');
        }
        if ((elements = document.getElementsByClassName('Dropdown-Instance-' + this.CurrentOption)) == null) {
        } else
        for (var i = 0; i < elements.length; i++) {
            function getStyle(element) {
                var newval = value;
                try {
                    var test = element['filter'];
                    if( test === 'private'
                        &&
                        Controller.UserId <= 0) {
                        newval = styleoff;
                    }
                    if (Controller.Debug > 1) {
                        console.log(funcname + '(); test=[' + test + '] new=[' + newval + ']');
                    }
                } catch (e) {
                    console.log(funcname + '() ' + e.toString());
                }
                return (newval)
            }
//            if (true) { // value == styleon) {
                value = getStyle(elements[i]);
//            }
            elements[i].setAttribute('style', value);
        }
        var dropdown = document.getElementById('Dropdown');
        if (dropdown != null && args.length > 2) {
//            dropdown.offsetLeft = obj.offsetLeft;
            if (this.Debug > 1) {
                console.log(funcname + '(); option=[' + args[2] + '] offsetLeft=[' + dropdown.offsetLeft + ']');
            }
        }
    },
    readySelection: function () {
        var element = new Object();;
        element.id = 'Selection-Title-Stylist';
        Controller.select(element);
    },
    readyToolbar: function () {
        var funcname = 'Controller.readyToolbar';
        console.log(funcname + '(); executing!');
        var element = new Object();
        element.id = 'Toolbar-Option-Search';
        Controller.select(element);
        if (AutoZoomObj.isDevice == true) {
            Controller.select(element);
        }
    },
    LastEvent: null,
    printMousePos: function (event) {
        console.log(
            "clientX: " + event.clientX +
            " - clientY: " + event.clientY
        );
        if (event.clientX > 0) {
            this.LastEvent = event;
        }
    },
    selectElement: function (obj) {
        $(obj).each(function (i, v) {
            try {
                var event = Controller.LastEvent;
                var x = event == null ? 0 : event.pageX ;// getPosition(document.getElementsByTagName('body')[0]).x;
                var ol = parseInt(v.offsetLeft);
                var or = parseInt(v.offsetLeft) + parseInt(v.offsetWidth);
                if (Controller.Debug >= 2) {
                    console.log('selectElement();' +
                        ' i=[' + i + ']' +
                        ' nodeName=[' + v.nodeName + ']' +
                        ' X=[' + x + ']' +
                        ' oL=[' + ol + ']' +
                        ' oR=[' + or + ']' +
                        ' id=[' + v.id + ']'
                        );
                }
                if (x >= ol && x <= or) {
                    console.log('#### ' + JSON.stringify(i + '=' + v.id));
                }
            } catch (e) {
                alert(e.toString());
            }
        });
    },
    handleClick(event, element, flag) {
        console.log('Click, event.pageX=[' + event.pageX + '] event.pageY=[' + event.pageY + ']');
        var zoomlev = AutoZoomObj.zoomLev;
        var bottomEvent = new $.Event("click");
        bottomEvent.pageX = Math.trunc(event.pageX * zoomlev);
        bottomEvent.pageY = Math.trunc(event.pageY * zoomlev);
        function simulateClick(element, eventobj) {
            var event = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'pageX': eventobj.pageX,
                'pageY': eventobj.pageY
            });
            var cb = element;
            var cancelled = !cb.dispatchEvent(event);
            if (cancelled) {
                // A handler called preventDefault.
 //               alert("cancelled");
            } else {
                // None of the handlers called preventDefault.
 //               console.log("click not cancelled");
            }
        }
        function triggerChildren(element, event) {
//           console.log('trigger node=[' + element.nodeName + ']');
            simulateClick(element, event);
            for (var i = 0; i < element.childNodes.length; i++) {
                triggerChildren(element.childNodes[i], event);
            }
        }
        try {
            if (flag == true) {
                triggerChildren(element, event);
            } else {
                simulateClick(element, event);
            }
        } catch (e) {
            console.log(e.toString());
        }
    },
    selectColumn: function (element) {
        var elemjq = $(element);
        console.log(elemjq[0].id);
        console.log('setclass(); class=[' + new String(element.className) + ']');
        function setclass(element, newclass) {
            var c = new String(element.className);
            console.log('setclass(); class=[' + c + ']');
            if (c.length > 0) {
                c += ' ';
            }
            c += newclass;
            console.log('new class=[' + c + ']');
            element.className = c;
        }
        function removeclass(element, oldclass) {
            var c = new String(element.className);
            console.log('removeclass(); class=[' + c + ']');
            var idx = -1;
            if ((idx = c.indexOf(oldclass)) >= 0) {
                if (idx > 0) {
                    idx = idx-1;
                }
                c = c.substr(0, idx);
                console.log('new class=[' + c + ']');
                element.className = c;
            }
        }
        if (RepeatObj.Scope.SelectedColumn != null) {
            RepeatObj.Scope.SelectedColumn.width('auto');
        }
        RepeatObj.Scope.SelectedColumn = elemjq;
        RepeatObj.Scope.SelectedColumn.width('80%');

        console.log('setclass(); class=[' + new String(element.className) + '] done.');
    },
    getPosition: function(el) {
        var xPosition = 0;
        var yPosition = 0;
        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
                var yScrollPos = el.scrollTop || document.documentElement.scrollTop;

                xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
                yPosition += (el.offsetTop - yScrollPos + el.clientTop);
            } else {
                xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return (new Object({
            x: xPosition,
            y: yPosition
        }));
    },
    processClickEvent: function (event) {
        var element = $("#Scope-Table-Content").find("thead")[0];
        console.log('click=' +
            ' pageX=[' + event.pageX + ']' +
            ' pageY=[' + event.pageY + ']'
            );
        CurrentEvent = event;
        function find(event, element) {
            var ret = false;
            if (element == null) { } else
                for (var i = 0; i < element.childNodes.length; i++) {
                    var child = element.childNodes[i];
                    if ((ret = find(event, child)) == true) {
                    } else
                    try {
                        if (child.nodeName !== 'TH') { } else
                            var pos = Controller.getPosition(child);
                            if (typeof (pos) === 'undefined') {
                            } else
                            if (
                                event.pageX >= pos.x
                                &&
                                event.pageX <= (pos.x + child.offsetWidth)
                                &&
                                (event.pageY >= pos.y || event.pageY < 0)
                                &&
                                (event.pageY <= (pos.y + child.offsetHeight) || event.pageY < 0)
                                ) {
                                ret = true;
                                console.log('click=' +
                                    ' pageX=[' + event.pageX + ']' +
                                    ' pos.x=[' + pos.x + ']' +
                                    ' child.offsetWidth=[' + child.offsetWidth + ']' +
                                    ' id=[' + child.nodeName + '.' + child.id + ']'
                                    );
                                Controller.selectColumn(child);
                                break;
                            }
                        } catch (e) {
                            console.log('find(); ' + e.toString());
                        }
                }
            return (ret);
        }
        try {
            find(event, element);
        } catch (e) {
            console.log('click(); ' + e.toString());
        }
    },
    getSibling: function (direction) {
        var pos = { x: 1, y: -1 };
        var width = direction == true ? 30 : -1;
        if (RepeatObj.Scope.SelectedColumn != null) {
            var element = RepeatObj.Scope.SelectedColumn[0];
            pos = Controller.getPosition(element);
            if (direction == true) {
                width += element.offsetWidth;
            } else {
                width = -1;
            }
            pos.y = -1;
            Controller.processClickEvent({
                pageX: (pos.x + width),
                pageY: pos.y
            });
        } else
        if (direction == false) {
            width = 30;
            Controller.processClickEvent({
                pageX: (pos.x + width),
                pageY: pos.y
            });
            Controller.getSibling(false);
        } else {
            Controller.processClickEvent({
                pageX: (pos.x + width),
                pageY: pos.y
            });
            Controller.getSibling(true);
        }
    },
    LastX: 0,
    processMouseEvent: function (event) {
        var ret = false
        console.log('mouse=' +
            ' pageX=[' + event.pageX + ']' +
            ' pageY=[' + event.pageY + ']'
            );
        if (Math.abs(event.pageX - this.LastX) > 20) {
            this.LastX = event.pageX;
            ret = true;
        }
        return (ret);
    },
    startApplication: function () {
        ParamObj.getParametersData( function () {
            RepeatObj.addList('Stylist', '/data/stylist.json', function () { });
            RepeatObj.addList('Toolbar', '/data/Toolbar.json', function () {
                Controller.readyToolbar();
                RepeatObj.addList('Dropdown', '/data/Dropdown.json', function () {
                    Controller.readyToolbar();
                    Application.initialize();
                });
            });
            RepeatObj.addList('Selection', '/data/Selection.json', Controller.readySelection);
            RepeatObj.addList('Edit', '/data/Edit.json', function () {
                console.log('Edit initialize(); complete');
            });
            RepeatObj.addList('New', '/data/New.json', function () {
                console.log('New initialize(); complete');
            });
            RepeatObj.addList('Login', '/data/Login.json', function () {
                console.log('Login initialize(); complete');
                var cookie = new ListObj('Cookie');
                cookie.processData = function (json) {
                    Controller.authtoken = json['Authtoken'];
                    console.log('cookie=' + JSON.stringify(this.authtoken));
                }
                cookie.ReadyFunc = function (list) {
                    Controller.UserId = 0;
                    Controller.Username = 'nginx';
                    Controller.Password = 'nginx';
                    try {
                        Controller.UserId = Controller.authtoken['username'];
                        Controller.Password = Controller.authtoken['password'];
                        console.log('Ready! UserId=[' + Controller.UserId + ']');
                        Controller.select({
                            id: 'Toolbar-Option-Booking-Week',
                            selected: true
                        });
                        Controller.select({
                            id: 'Toolbar-Option-Search',
                            selected: true
                        });
                    } catch (e) {
                        console.log('Ready=' + e.toString());
                    }
                }
                cookie.handleFailure = function (err) {
                    alert('err='+ JSON.stringify(err));
                }
                cookie.getData( '/private');
            });
            RepeatObj.addList('Event', '/data/Event.json', function () {
            });
        });
    }
}
var WidthState = {
    element: null,
    width: 'auto',
    setWidth: function (element, width) {
        console.log('WidthState.setWidth()');
        if (this.element != null) {
            this.element.style.width = this.width;
        }
        this.element = element;
        this.width = this.element.style.width;
        //        showProperties(element);
        var currentwidth = element.style.cssText;
        if (empty(currentwidth) == false) {
            //            this.width = currentwidth; // element.style.width;
            //            alert('Original width = [' + this.width + ']');
        }
        var newwidth = parseInt(width);
        var oldwidth = 0;
        oldwidth = parseInt(this.width);
        if (isNaN(oldwidth)) {
            oldwidth = 0;
        }
        newwidth = newwidth + oldwidth;
        var newstr = '' + newwidth + 'em';
        console.log('newwidth=[' + newstr + ']' +
            ' old=[' + element.style['maxWidth'] + ']' +
            ' id=[' + element.id + ']');
//            ' style=[' + JSON.stringify(element.style,RepeatObj.replacer) + ']');
        element.style['maxWidth'] = newstr;
    }

}
function increaseWidth(element) {
    WidthState.setWidth(element, '5em');
}

var ScopePosition = null;
var ScopeHeight = 0;
(function () {
    "use strict";
    var id = 'Scope-Table-Body';
    var div = document.getElementById(id);
    if (div == null) {
        alert('Cannot find id="Scope-Table-Body"');
    } else {
        div.onmousemove = handleMouseMove;
        ScopePosition = getPos(div);
        ScopeHeight = $('#' + id).height();;
    }
    function getPos(el) {
        // yay readability
        for (var lx = 0, ly = 0;
             el != null;
             lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return { x: lx, y: ly };
    }
    function handleMouseMove(event) {
        RepeatObj.checkScroll();
        var dot, eventDoc, doc, body, pageX, pageY;
        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y
        // are, calculate pageX/Y - logic taken from jQuery
        // Calculate pageX/Y if missing and clientX/Y available
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop || body && body.scrollTop || 0) -
              (doc && doc.clientTop || body && body.clientTop || 0);
        }
        var basey = (130);
        var maxy = (720);
        var factor = 1000; // 00 / (AutoZoomObj.zoomLev * 100);
        if (factor >= 1000) {
            factor = factor * 7 / 6;
            basey = 112;
        } else {
            maxy = 680;
        }
        try {
            maxy = $('#Scope-Table-Body').height();
            basey = $('#Scope-Table-Body').offset().top;
        } catch (e) {
            console.log(e.toString());
        }
        maxy += basey;
        var maxrows = RepeatObj.Scope.MaxRows;
        var y = (event.pageY);
        var row = Math.trunc(maxrows * (y - basey)/ (maxy - basey));
        var size = (maxy - basey) / maxrows;
        if (this.Debug > 1) {
            console.log('zoomLev=[' + AutoZoomObj.zoomLev + '] size=[' + maxrows + '] factor=[' + factor + ']');
            console.log('mouse event [' + y + '] row=[' + row + '] Offset=[' + basey + '] Height=[' + maxy + ']');
        }
        try {
            var entry = RepeatObj.Scope.DataMap.map[row + RepeatObj.Scope.Cursor];
            if (this.Debug > 1) {
                console.log(JSON.stringify(entry));
            }
            var lastnode = RepeatObj.Scope.Selected;
            var current = RepeatObj.Scope.Nodes[row];
            if (lastnode != current) {
                RepeatObj.Scope.ThisRow = row;
                current.setAttribute('style', 'background-color: #2B65EC');
                RepeatObj.Scope.Selected = current;
                Controller.ActionEntry = entry;
                if (lastnode != null) {
                    lastnode.setAttribute('style', 'background-color: transparent')
                }
            }
            console.log('done!');
        } catch (e) {
            console.log(e.toString());
        }
    }
    $("#Booking-Table-Map").click(function (event) {
        console.log('Booking-Table-Map');
        Controller.handleClick(event, document.getElementById('calendar'), false);
    });
    try {
        $("#mytable").find("thead").click(Controller.processMouseEvent);
//        $("thead#Scope-Table-Content").click(Controller.processMouseEvent);
    } catch (e) {
        alert(e.toString());
    }
//    document.addEventListener("click", Controller.processClickEvent);
    try {
//        $("#Scope").mousedown(Controller.processMouseEvent);
    } catch (e) {
        alert(e.toString());
    }
    try {
        $("#Scope-Table").width($(window).width() * 94 / 100);
    } catch (e) {
        alert(e.toString());
    }
    console.log('Done init!');
})();
var ClickObj = null;
$("#Scope-Table-Body").mouseup(function (event) {
    if (Controller.processMouseEvent(event) == true
        &&
        AutoZoomObj.isDevice == true) { } else
        if (RepeatObj.isScroll() == true) {
            console.log('isScroll');
    } else
    try {
        if (true) { // RepeatObj.Scope.Selected === ClickObj || AutoZoomObj.isDevice == false) {
            Controller.select(RepeatObj.Scope.Selected);
            ClickObj = null;
        } else {
            ClickObj = RepeatObj.Scope.Selected;
        }
    } catch (e) { }
});

$("#Scope-Table-Body").click(function (event) {
    try {
        RepeatObj.checkScroll()
    } catch (e) { }
    if (AutoZoomObj.isDevice == false) { } else
    if (Controller.processMouseEvent(event) == true) { } else
    try {
        if (true) { // RepeatObj.Scope.Selected === ClickObj || AutoZoomObj.isDevice == false) {
            Controller.select(RepeatObj.Scope.Selected);
            ClickObj = null;
        } else {
            ClickObj = RepeatObj.Scope.Selected;
        }
    } catch (e) { }
});


