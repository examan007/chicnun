// JavaScript source code
function ControlObj() {
    var that = new Object
    that.Control = 'Control';
    that.State = 'Initial';
    that.Section = 'Selection';
    that.Option = new optobj();
    that.checkForm = function (success, failure, data) {
        return (false);
    } 
    that.hide = function () {
        Controller.hideSection(this.Section); // Controller.CurrentState);
    }
    that.show = function () {
        Controller.showSection(this.Section); // Controller.CurrentState);
    }
    that.complete = function (json) {
    }
    that.scope = function () {
    }
    that.action = function (obj) {
    }
    that.submit = function (obj) {
    }
    that.setClass = function () {
        if (this.State === 'Selection') {
            Controller.setClassName('largename');
        } else {
            Controller.setClassName('smallname');
        }
    }
    that.getLastState = function () {
        return (this.State);
    }
    that.setState = function (obj, newstate) {
        var ret = false;
        return (ret);
    }
    that.changeState = function (obj, nextflag) {
        var ret = true;
        return (ret);
    }
    that.postsetState = function (newstate) {
    }
    that.option = function (entry, option) {
    }
    that.shift = function (direction) {
    }
    return (that);
}
function SearchObj() {
    var that = new ControlObj();
    that.Control = 'Search';
    that.State = 'Selection';
    that.Option = new scopeobj('Stylist');
    that.hide = function () {
        Controller.hideSection(this.State);
    }
    that.show = function () {
        Controller.showSection(this.State);
    }
    that.scope = function () {
    }
    that.getLastState = function () {
        return (this.State);
    }
    that.setState = function (obj, newstate) {
        var ret = false;
        if (newstate === this.Control) {
            ret = true;
        } else
        if (newstate === 'Selection') {
            Controller.options(obj, false);
            Controller.CurrentState = 'Selection';
            Controller.setClassName('largename');
            ret = true;
        } else
        if (newstate === 'Scope') {
            that.obj = {
                id: obj.id,
                selected: true
            }
            var names = '';
            var oldfilter = Controller.Filter;
            if (obj.id === 'Back') {
                var option = Application.getCurrentOption('Search');
                obj = {
                    id: 'Selection-Name-' + option
                }
            }
            try {
                names = obj.id.split('-');
                Controller.Filter = names[names.length - 1];
            } catch (e) { }
            Controller.options(obj, false);
            Controller.CurrentState = 'Scope';
            var objname = obj.id
            if (obj.id !== 'Back') {
                console.log('New Scope; here! id=[' + obj.id + ']');
                //                delete (RepeatObj.Data['Scope']);
            }
            var datadir = Controller.DataDir;
            that.newstate = newstate;
            if (obj.id === 'Selection-Name-Client') {
                var callback = execute(that, 'Clients', Controller.PrivateDir);
                if (Controller.UserId <= 0) {
                    Controller.authenticate(callback);
                } else {
                    callback();
                }
            } else
            if (obj.id === 'Selection-Name-Stylist') {
                execute(that, 'Users', datadir) ();
            } else {
                execute(that, objname, datadir) ();
            }
            function complete (obj) {
                var control = obj;
                return (function () {
                    console.log('complete(); ' + JSON.stringify(that));
                    if (Controller.CurrentState === 'Scope') {
                        that.show(that.Section);
                    } else {
                        var args = control.obj.id.split('-');
                        var element = new Object();
                        element.id = 'Toolbar-Option-Search-' + args[2];
                        control.State = 'Selection';
                        Controller.SelectedButton = element;
                        Controller.select(element);
                    }
                });
            }
            function execute(obj, name, dir) {
                var control = obj;
                var objname = name;
                var datadir = dir;
                var callback = complete(control);
                return (function () {
                    var filename = datadir + objname + '.json';
                    Controller.setClassName('smallname');
                    console.log('execute(); filename=[' + filename + ']');
                    RepeatObj.addList(
                        'Scope',
                        filename,
                        callback);
                });
            }
            ret = true;
        } else
        if (newstate === 'Action') {
            Controller.options(obj, false);
            var key = null;
            var entry = null;
            if ((entry = Controller.getEntry(obj)) == null) {
                var test = null;
                if ((test = Controller.getTest(obj)) == null) {
                    console.log('Action; unable to resolve data element!' + JSON.stringify(obj));
                } else {
                    Controller.StylistUserId = test;
                    Controller.StylistUser = RepeatObj.getEntry('Users', 'UserId', test);
                    console.log('StylistUserId=[' + test + ']:[' + JSON.stringify(Controller.StylistUser) + ']');
                    function editevent(stylist, stage) {
                        var userid = stylist;
                        var edit = stage;
                        return (function () {
                            if (typeof (edit) === 'undefined') { } else {
                                edit(userid);
                            }
                        });
                    }
                    Controller.editevent = editevent(test, Controller.editeventstage);
                    delete (Controller.editeventstage);
                    Controller.select({
                        id: 'Toobar-Option-Booking',
                        selected: true
                    })
                }
                ret = false;
            } else {
                var latlng;
                if ((key = Controller.getKey(obj, 'Locations', entry)) != null) {
                } else
                    if ((key = Controller.getKey(obj, 'formatted_address', entry)) != null) {
                        try {
                            GoogleAPI.Position =
                                GoogleAPI.getLatLng(entry['lat'], entry['lng']);
                        } catch (e) {
                            alert(funcname + e);
                        }
                    }
                //                RepeatObj.Scope = null;
                Controller.CurrentEntry = entry;
                GoogleAPI.inject(key);
                Controller.CurrentState = 'Action';
                Controller.setClassName('smallname');
                CheckSizeZoom();
                ret = true;
            }
        } else
        if (newstate === 'NewAction') {
        }
        this.State = Controller.CurrentState;
        return (ret);
    }
    that.changeState = function (obj, nextflag) {
        var oldstate = Controller.CurrentState;
        var changeflag = false;
        if (oldstate === 'Selection') {
            if (nextflag === true) {
                changeflag = Controller.setState(obj, 'Scope');
            }
        } else
        if (oldstate === 'Scope') {
            if (nextflag === false) {
                changeflag = Controller.setState(obj, 'Selection');
            } else {
                changeflag = Controller.setState(obj, 'Action');
            }
        } else
        if (oldstate === 'Action') {
            if (nextflag === false) {
                changeflag = Controller.setState(obj, 'Scope');
                Controller.select({
                    id: 'Selected-Name-' + this.Option.name,
                    selected: true
                });
            }
        } else {
            alert('unknown state in search');
        }
        if (changeflag == true) {
            Controller.hideSection(oldstate);
            Controller.showSection(Controller.CurrentState);
            Controller.LastObject = obj;
        }
        return (changeflag);
    }
    that.option = function (entry, option) {
        if (this.State === 'Selection' && option == 'Selection') {
            return;
        }
        var funcname = this.Control + '.option';
        var newobj = new Object();
        newobj.id = 'Selection-Name-' + option;
        newobj.nodeName = 'div';
        console.log(funcname + '();' +
            ' Controller.CurrentState=[' + Controller.CurrentState + ']' +
            ' option=[' + option + ']' +
            ' entry=' + JSON.stringify(entry));
        this.Option = new scopeobj(option);
        if (Controller.CurrentState == 'Selection') {
            Controller.next(newobj, false);
        } else
            if (Controller.CurrentState == 'Scope') {
                Controller.prev(newobj, false);
                Controller.next(newobj, false);
            }
    }
    that.postsetState = function (newstate) {
        var funcname = this.Control + '.postsetState';
        var element = new Object();
        var option = Application.getCurrentOption(that.Control);
        element.id = 'Selected-Option-' + (newstate == null ? option : newstate);
        console.log(funcname + '(); id=[' + element.id + ']');
        Controller.select(element);
    }
    that.shift = function (direction) {
        console.log(direction);
        Controller.getSibling(direction);
    }
    return (that);
}
function BookingObj() {
    var that = new ControlObj();
    that.Control = 'Booking';
    that.State = 'Week';
    that.Section = 'Booking';
    that.Complete = null;
    that.Entry = null;
    that.Action = null;
    that.EditView = null;
    that.Calendar = new EventListObj();
    that.Schedule = new EventListObj('#schedule');
    that.checkForm = function (success, failure, data) {
        if (this.Action === 'Save') {
            return (this.Calendar.updateEvent(success, failure, data));
        } else {
            return (true);
        }
    }
    that.restoreAction = function () {
        var option = Application.getCurrentOption(null);
        var entry = Application.getOptionEntry(null);
        if (entry == null) {
            entry = that.Entry;
        }
        console.log('restoreAction ' + JSON.stringify(entry));
        RepeatObj.useList.setActions(entry);
        Controller.setClassName('smallname');
        RepeatObj.useList.dialog.hide();
        RepeatObj.useList.initialize(option, false);
    }
    that.scope = function () {
    }
    that.setClass = function () {
        Controller.setClassName('nodomain');
    }
    that.getLastState = function () {
        return ('Booking');
    }
    that.submit = function (obj) {
        var id = obj.id;
        var args = id.split('-');
        var option = args[2];
        this.Action = option;
        console.log('submit() [' + option + ']');
        if (option === 'Destroy') {
            function complete(control) {
                var lcontrol = control;
                var lobj = obj;
                return (function () {
                    lcontrol.changeState(lobj, false);
                });
            }
            this.Calendar.removeEvent(RepeatObj.useList.data, complete(this));
        } else
        if (option === 'Save') {
            console.log('submit() ' + JSON.stringify(RepeatObj.useList.objects));
//            this.changeState(obj, false);
        } else
        if (option === 'Cancel') {
//            this.changeState(obj, false);
        }
    }
    that.action = function (callback) {
        var funcname = 'Booking.action';
        this.Complete = callback;
        Controller.select({ id: 'Dropdown-Option-Event'});
    }
    that.changeState = function (obj, nextflag) {
        var oldstate = this.Section;
        var changeflag = false;
        var newstate = oldstate;
        console.log('obj=[' + obj.id + '] nextflag=[' + nextflag + '] oldstate=[' + oldstate + ']');
        var args = obj.id.split('-');
        if (oldstate === 'Booking') {
            if (nextflag === true) {
                changeflag = true;
                newstate = 'Account';
                this.restoreAction();
            }
        } else
        if (oldstate === 'Account') {
            if (nextflag === false) {
                changeflag = true;
                if (this.EditView == null) {
                    newstate = 'Booking';
                    this.Calendar.processData = this.Calendar.this_processData;
                    this.Schedule.processData = this.Schedule.this_processData;
                } else {
                    this.EditView = null;
                    this.Calendar.processData = this.Calendar.uber_processData;
                    this.Schedule.processData = this.Schedule.uber_processData;
                    newstate = 'Scope';
                }
            }
        } else
        if (oldstate === 'Scope') {
            var done = false;
            if (args.length < 3) { } else
            if (args[0] !== 'Scope') { } else
            if (args[1] !== 'Option' && args[1] !== 'Item') { } else {
                done = true;
                newstate = 'Booking';
                changeflag = true;
                this.EditView = 'List';
                function edit(str) {
                    var event = null;
                    try {
                        console.log('before edit=' + str);
                        event = JSON.parse(str);
                    } catch (e) {
                        console.log(e.toString());
                    }
                    return (function () {
                        console.log('edit=' + JSON.stringify(event));
                        Controller.editEvent(event, function () {
                            console.log('Done editEvent();');
                        }); 
                    });
                }
                try {
                    var index = parseInt(args[2] === 'Value' ? args[3] : args[2]); // + parseInt(this.Calendar.Cursor);
                    console.log('length=[' + this.Calendar.Entries.length + '] index=[' + index + ']');
                    var event = this.Calendar.DataMap.map[index];  // Controller.ActionEntry; // this.Calendar.DataMap.getRow(index); // Entries[index];
                    var str = JSON.stringify(event);
                    obj.editpended = edit(str);
                } catch (e) {
                    alert(e.toString());
                }
            }
            if (done == true) { } else
            if (nextflag == false) {
                newstate = 'Booking';
                changeflag = true;
            }
        } else {
            alert('state=[' + oldstate + ']');
        }
        if (changeflag == true) {
            Controller.hideSection(oldstate);
            Controller.showSection(newstate);
            this.Section = newstate;
            CheckSizeZoom();
        }
        if (this.Section === 'Booking') {
            Controller.setClassName('nodomain');
            $('#calendar').fullCalendar('refetchEvents');
        } else {
            Controller.setClassName('smallname');
        }
        return (changeflag);
    }
    that.option = function (entry, option) {
        var funcname = this.Control + '.option';
        if (typeof (entry.Key) === 'undefined') {} else
        if (entry.Key === 'Event') {
            console.log(funcname + '() set entry=' + JSON.stringify(entry));
            this.Entry = entry;
        }
//        RepeatObj.useList.setActions(entry);
        try {
            var obj = new Object();
            obj.funcname = funcname;
            obj.control = this
            obj.entry = entry;
            obj.option = option;
            obj.callback = function callback(obj) {
                console.log(obj.funcname + '(); callback()');
                var postobj = obj.control.Complete;
                if (postobj != null) {
                    obj.control.Complete = null;
                    postobj();
                }
            }
            if (option !== 'Event') {
                var method = entry['Method'];
                var argument = entry['Argument'];
                console.log(funcname + '(); before fullCalendar(' + method + ', ' + argument + ');');
                function run(method, argument, id) {
                    $(id).fullCalendar(method, argument);
                    if (option === 'Today') {
                        $(id).fullCalendar('gotoDate', this.Calendar.Today.format());
                    }

                }
                run(method, argument, '#calendar');
                run(method, argument, '#schedule');
                console.log(funcname + '(); after fullCalendar(' + method + ', ' + argument + ');');
            } else
            if (Controller.UserId <= 0) {
                console.log(funcname + '(); User=[' + Controller.Username + ']');
                function execute(obj) {
                    var authobj = obj;
                    return (function () {
                        console.log(authobj.obj.funcname + '(); EXECUTE option=[' + authobj.obj.option + ']');
                        var element = new Object();
                        element.id = 'Toolbar-Option-Booking';
                        Controller.SelectedButton = element;
                        Controller.select(element);
                        authobj.obj.callback(authobj.obj);
                    });
                }
                Controller.authenticate(execute(authobj));
            } else {
                RepeatObj.useList.setActions(entry);
                obj.callback(obj);
            }
        } catch (e) {
            console.log(funcname  + e.toString());
        }
    }
    that.postsetState = function (newstate) {
        var funcname = this.Control + '.postsetState';
        var element = new Object();
        console.log('newstate=[' + newstate + ']');
        this.State = newstate == null ? this.State : newstate;
        newstate = this.State;
        element.id = 'Selected-Option-' + this.State;
        console.log(funcname + '(); id=[' + element.id + ']');
        this.restoreAction();
        Controller.select(element);
        var obj = {
            id: 'Toolbar-Option-Booking'
        }
        this.changeState(obj, false);
        if (newstate === 'List') {
            console.log('option=[' + newstate + ']');
            Controller.hideSection(this.Section);
            Controller.setClassName('smallname');
            Controller.Filter = 'Events';
            this.Section = 'Scope';
            Controller.showSection(this.Section);
            try {
                function initialize(cal) {
                    cal.DataKey = Controller.UserId;
                    cal.processData = cal.uber_processData;
                    RepeatObj.Data[Controller.UserId] = cal;
                    cal.Template = RepeatObj.getTemplate(cal.Name);
                }
                initialize(that.Schedule);
                initialize(that.Calendar);
            } catch (e) {
                console.log(funcname + 'e.toString()');
            }
            RepeatObj.addListObj(this.Calendar, 'Scope-Option-List', 'Events.json', function () {
                console.log(funcname + '(); calendar entry list [' + Controller.UserId + ']');
                scrollController({}, true);
            });
            RepeatObj.addListObj(this.Schedule, 'Scope-Option-List', 'Events.json', function () {
                console.log(funcname + '(); calendar entry list [' + Controller.UserId + ']');
                scrollController({}, true);
            });
        } else {
            this.Calendar.processData = this.Calendar.this_processData;
            $('#calendar').fullCalendar('refetchEvents');
        }
    }
    that.setState = function (obj, newstate) {
        var ret = true; // false;
        try {
            var minW = $(window).height();
            $('#calendar').fullCalendar('option', 'height', minW * 17 / 20);
            ret = true;
        } catch (e) {
            console.log(e.toString());
        }
        return (ret);
    }
    that.shift = function (direction) {
        if (this.Section === 'Scope') {
            Controller.getSibling(direction);
        } else {
            this.Calendar.shift(direction);
        }
    }
    return (that);
}

function AccountObj() {
    var that = new ControlObj();
    that.Control = 'Account';
    that.State = 'Login';
    that.Section = 'Account';
    that.checkForm = function (success, failure, data) {
        return (RepeatObj.useList.checkForm(success, failure, data));
    }
    that.complete = function (json) {
        function show(status, message, flag) {
            if (flag == true) {
                console.log(status + ': ' + message);
            } else {
                RepeatObj.useList.show(status, message);
            }
        }
        var flag = false;
        try {
            if (this.State === 'Login') {
                Controller.initializeUser();
                Controller.select({
                    id: 'Toolbar-Option-Booking-Today',
                    selected: true
                });
                flag = true;
            } 
            show('Success', json['Message'], flag);
        } catch (e) {
            show('Success', 'Login as [' + Controller.Username + ']!', flag);
        }
    }
    that.scope = function () {
    }
    that.setClass = function () {
        Controller.setClassName('smallname');
    }
    that.getLastState = function () {
        return ('Account');
    }
    that.setState = function (obj, newstate) {
        var ret = true;
        return (ret);
    }
    that.changeState = function (obj, nextflag) {
        alert(JSON.stringify(obj));
    }
    that.postsetState = function (newstate) {
        var funcname = this.Control + '.postsetState';
        var element = new Object();
        element.id = 'Selected-Option-' + (newstate == null ? this.State : newstate);
        console.log(funcname + '(); id=[' + element.id + ']');
        Controller.select(element);
    }
    that.option = function (entry, option) {
        var funcname = this.Control + '.option';
        RepeatObj.useList.forceActions(entry);
        console(funcname + JSON.stringify(entry));
        try {
            if (RepeatObj.useList.initialize(option, false) == true) {
                this.State = option;
            } else
                if (this.Control === 'Account') {
                    // RepeatObj.useList.initialize(this.State, false);
                }
        } catch (e) {
            RepeatObj.useList.initialize(this.State, false);
        }
    }
    return (that);
}
