function appmom(datetime, newtime) {
    var inst = new moment(datetime);
    inst.uberformat = inst.format;
    inst.newtime = newtime;
    inst.format = function (arg) {
        var msg = inst.uberformat(arg);
        msg = msg.substr(0, 19);
        if (typeof (inst.newtime) === 'undefined') {
        } else {
            msg = msg.substr(0, 10);
            msg = msg.concat(newtime);
        }
        console.log('appmom.format(); msg=[' + msg + ']');
        return (msg);
    }
    return (inst);
}
function EventListObj(id) {
    var List = new ListDataObj('Scope');
    if (typeof (id) === 'undefined') {
        List.Id = '#calendar';
    } else {
        List.Id = id;
    }
    List.Debug = 0;
    List.Entries = [];
    List.Refresh = false;
    List.Complete = null;
    List.Closure = null;
    List.UserId = 0;
    List.Sequence = 0;
    List.Revert = null;
    List.Update = null;
    List.View = null;
    List.uber_initialize = List.initialize;
    List.this_initialize = function () {
        List.Entries = [];
        List.uber_initialize();
        $(List.Id).fullCalendar('refetchEvents');
    }
    List.copyFromAttrs = function (eventobj, newevent) {
        for (var key in eventobj) {
            eventobj[key] = JSON.parse(JSON.stringify(newevent[key]));
        }
    }
    List.copyToAttrs = function (eventobj, newevent) {
        for (var key in eventobj) {
            newevent[key] = JSON.parse(JSON.stringify(eventobj[key]));
            console.log('newevent[' + key + ']=[' + newevent[key] + ']');
        }
    }
    List.findEventIndex = function (calEvent) {
        var ret = -1;
        try {
            function loop(test, entry) {
                var match = true;
//                console.log('entry=[' + JSON.stringify(entry) + ']');
                if (typeof (test) === 'undefined'
                    ||
                    typeof (entry) === 'undefined') {
                    match = false
                } else
                if (test == null || entry == null) {
                    match = false
                } else
                for (var key in entry) {
                    if (typeof (entry[key]) === 'undefined') {
                        if (typeof (test[key]) === 'undefined') {
                        } else
                            if (key.indexOf('title') == 0 || key.indexOf('start') == 0 || key.indexOf('end') == 0) {
                            match = false;
                            break;
                        }
                    } else
                    if (key === 'UniqueId') { } else
                    if (entry[key] == null) {
                        if (test[key] == null) {
                        } else {
                            match = false
                            break;
                        }
                    } else
                    if (test[key] == null) {
                        match = false
                        break;
                    } else
                    if (entry[key].length != test[key].length) {
                        match = false;
                        break;
                    } else
                    if (entry[key] !== test[key]) {
                        match = false;
                        break;
                    }
                }
                return (match);
            }
            if (List.Entries == null) { } else
            for (var i = 0; i < List.Entries.length; i++) {
                var testevent = JSON.parse(JSON.stringify(calEvent));
  //              console.log('test=[' + JSON.stringify(testevent) + ']');
                if (loop(testevent, List.Entries[i]) == true) {
                    ret = i;
                    console.log('FOUND!=' + JSON.stringify(List.Entries[ret]));
                    break;
                }
            }
        } catch (e) {
            console.log('findEventIndex' + e.toString());
            ret = -1
        }
        return (ret);
    }
    List.uber_processData = List.processData;
    List.this_processData = function (data) {
        Controller.Filter = 'Events';
        List.uber_processData(data);
        var funcname = 'List.processData';
        console.log(funcname + '(); executing ...');
        if (List.Debug > 0) {
            console.log(funcname + '(); executing; data=' + JSON.stringify(data));
        }
//        List.Entries = [];
        List.Sequence = parseInt(data.sequence);
        if (typeof (data.map) === 'undefined') { } else
        if (data.map == null) { } else
        if (data.map.length < 1) { } else {
            List.Entries = data.map;
        }
        var callback;
        if ((callback = List.Complete) != null) {
            console.log(funcname + '(); complete ...');
            List.Complete = null;
            try {
                callback(List.Entries);
            } catch (e) {
                console.log(funcname + e.toString());
            }
        }
        if ((callback = List.Closure) != null) {
            console.log(funcname + '(); closure ...');
            List.Closure = null;
            try {
                callback();
            } catch (e) {
                console.log(funcname + e.toString());
            }
        }
        var save = 'Week';
        function execute(option) {
            var obj = new Object();
            obj.id = 'Toolbar-Option-Booking-' + option;
            Controller.select(obj);
        }
//        execute('List');
//        execute(save);
        console.log(funcname + '(); done!');
    }
    List.processData = List.this_processData;
    List.handleFailure = function (err) {
    }
    List.saveEvents = function (process, revert) {
        var obj = new Object();
        obj.operation = 'Write';
        obj.filename = 'Events.json';
        obj.map = List.Entries;
        obj.sequence = List.Sequence;
        List.sendData('/private/Success.json', obj, process, revert);
    }
    List.save = function (proceed, revert) {
        function success() {
            var obj = {
                success: proceed,
                failure: revert
            }
            return (function (data) {
                console.log('List.save(); data=' + JSON.stringify(data));
                if (data['Status'] === 'Success') {
//                    List.Entries = [];
                    obj.success(data);
                    List.Sequence = parseInt(data.sequence);
                    console.log('List.save(); success!');
                    $(List.Id).fullCalendar('refetchEvents');
                    if (typeof (List.savecomplete) === 'undefined') { } else {
                        List.savecomplete();
                        delete (List.savecomplete);
                    }
                } else {
                    obj.failure(data.Message);
                    alert('Reverted! err=[' + data.Message + ']');
                }
            });
        }
        function failure() {
            var obj = {
                failure: revert
            }
            return (function (err) {
                obj.failure(err);
                alert('Reverted! err=[' + err + ']');
            });
        }
        List.saveEvents(success(), failure());
    }
    List.removeEvent = function (event, success) {
        console.log('removeEvent(); event=' + JSON.stringify(event));
        function revert() {
            var savelist = JSON.stringify(List.Entries);
            return (function () {
                List.Entries = JSON.parse(savelist);
            });
        }
        var index = List.findEventIndex(event);
        if (index < 0) {
            alert('List.removeEvent(); NOT found event=' + JSON.stringify(event));
        } else {
            List.Entries.splice(index, 1);
            List.save(
            function (data) {
                success();
                $(List.Id).fullCalendar('refetchEvents');
            },
            revert());
        }
    }
    List.addEvent = function (success, failure, event) {
        List.Entries.push(event);
        List.save(success, failure);
    }
    List.initializeControl = function (callback) {
        if (List.Debug > 0) {
            console.log('List.initializeControl(); obj=' + JSON.stringify(obj));
        }
        if (Controller.UserId != List.UserId) {
            List.Entries = [];
            List.UserId = Controller.UserId;
            List.Closure = callback;
//            $(List.Id).fullCalendar('refetchEvents');
        } else {
            callback();
        }
    }
    List.isValidEvent = function (event_in) {
        var ret = false;
        try {
            var event = JSON.parse(JSON.stringify(event_in));
            var start = moment(event.start);
            var end = moment(event.end);
            var duration = moment.duration(end.diff(start.format()));
            var hours = duration.asHours();
            if (hours > 0) {
                ret = true;
            }
        } catch (e) {}
        return (ret);
    }
    List.changeEvent = function (event, newevent, revertFunc) {
        console.log('changeEvent event=' + JSON.stringify(event));
        console.log('changeEvent newevent=' + JSON.stringify(newevent));
        var index = List.findEventIndex(event);
        if (index < 0) {
            console.log('changeEvent() NOT found!' + JSON.stringify(event));
            revertFunc('Event not found! ' + JSON.stringify(event));
        } else
        if (List.isValidEvent(newevent) == false) {
            console.log('changeEvent() invalid new event!' + JSON.stringify(newevent));
            revertFunc('New event is invalid! ' + JSON.stringify(newevent));
        } else {
            function revert() {
                var saveobj = new Object();
                var newobj = new Object();
                List.copyToAttrs(List.Entries[index], saveobj);
                List.copyToAttrs(newevent, List.Entries[index]);
                List.copyToAttrs(List.Entries[index], newobj);
                complete = revertFunc;
                return (function (err) {
                    var index = List.findEventIndex(newobj);
                    if (index < 0) {
                        alert('revert() NOT found! ' + JSON.stringify(event));
                    } else {
                        List.copyFromAttrs(List.Entries[index], saveobj);
                    }
                    complete();
                });
            }
            function success() {
                return (function (data) {
                    Controller.CurrentObj.changeState({
                        id: 'Scope-Option-Booking',
                        selected: true
                       }, false);
                    $(List.Id).fullCalendar('refetchEvents');
                });
            }
            List.save(success(), revert());
        }
    }
    List.swallownextshift = false;
    List.shift = function (direction) {
        List.shiftCntrl(direction, List.swallownextshift);
        List.swallownextshift = false;
        try {
            if (List === Controller.CurrentObj.Schedule) {
                SUNCal.removeTracker();
                SUNCal.installTracker()
            } else {
                Controller.CurrentObj.Schedule.shift(direction);
            }
        } catch (e) {
            console.log(e.toString());
        }
    }
    List.shiftCntrl = function (direction, swallow) {
        function hideBooking() {
            var element = document.getElementById('Booking');
            element.setAttribute('style', 'visibility:hidden');
            window.setTimeout(function () {
                element.setAttribute('style', 'visibility:visible');
            }, 500);
        }
        function scrollTimeToCurrent() {
            var scrollEl = document.querySelector('.fc-scroller');
            var scrollFraction = scrollEl.scrollTop / scrollEl.scrollHeight;
            var scrollTime = moment().startOf('day').add(3600 * 24 * scrollFraction, 's').format('HH:mm:00');
            $(List.Id).fullCalendar('option', 'scrollTime', scrollTime);
            scrollEl.scrollTop = scrollSave;
            console.log('scrollTime=[' + scrollTime + ']');
        }
        function getScrollTop() {
            var top = 0;
            var scrollEl = document.querySelector('.fc-scroller');
            if (scrollEl != null) {
                top = scrollEl.scrollTop;
            }
            return (top);
        }
        function setScrollTop(top) {
            var scrollEl = document.querySelector('.fc-scroller');
            if (scrollEl != null) {
                scrollEl.scrollTop = top;
            }
        }
        if (swallow == false) {
//            hideBooking();
//            scrollTimeToCurrent();
            var save = getScrollTop();
            $(List.Id).fullCalendar(direction == true ? 'next' : 'prev');
            setScrollTop(save);
        }
    }
    /*
		date store today date.
		d store today date.
		m store current month.
		y store current year.
	*/
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
    var swipe = AutoZoomObj.isDevice == true ? '' : 'prev,next'
			
	/*
		Initialize fullCalendar and store into variable.
		Why in variable?
		Because doing so we can use it inside other function.
		In order to modify its option later.
	*/
	function createEvent(start, end) {
	    function create_event() {
	        var mom = new moment();
	        newEvent = {
	            start: start.format(),
	            end: end.format(),
	            allDay: false,
	            title: '',
	            backgroundColor: 'transparent',
	            color: '#000080',
	            create: mom.format()
	        }
	        if (Controller.StylistUserId.length > 0) {
    	        newEvent.stylist = Controller.StylistUserId;
            }
            return (function () {
                List.addEvent(
                function (data) {
                    console.log('Controller.createEvent(); complete!');
                    console.log(JSON.stringify(data));
                    console.log(JSON.stringify(newEvent));
                    List.shift(true);
                    List.shift(false);
                    try {
                        Controller.editEvent(newEvent, function () {
                            alert('after edit init');
                        });
                    } catch (e) {
                        console.log(e.toString());
                    }
                },
                function (err) {
                    alert(err);
                }, newEvent);
            });
        }
        function controller(createfunc) {
            create = createfunc;
            return (function () {
                List.initializeControl(function () {
                    // 		        $(List.Id).fullCalendar('refetchEvents');
                   create();
                    console.log('Controller.createEvent(); NO swallow!'); // complete!');
                });
            });
        }
        var callback = create_event();
        if (Controller.UserId == 0) {
            Controller.createEvent(controller(callback));
        } else {
            callback();
        }
    }
	List.nobounce = true;
	function createDefaultEvent(date, view) {
	    console.log('createDefaultEvent(); date=[' + date + ']');
	    var start = null;
	    if (typeof (view.name) === 'undefined') { } else
	    if (view.name === 'agendaWeek'
	        ||
            view.name === 'basicWeek') {
	        start = new appmom(date);

	    } else {
	        var str = (new moment(date)).format().substr(0, 10);
	        start = new appmom(str, 'T06:00:00');
	    }
	    var end = new appmom(start.format());
	    end.add(0.5, 'hours')
	    createEvent(start, end);
	}
	List.updateEvent = function (success, failure, data) {
	    var funcname = 'List.updateEvent';
	    console.log(funcname + JSON.stringify(data));
	    var ret = true;
	    function update() {
	        var event = RepeatObj.useList.data;
	        console.log(funcname + JSON.stringify(event));
	        return (function () {
	            console.log('update');
	            var index = List.findEventIndex(JSON.parse(JSON.stringify(event)));
	            if (index < 0) {
	                console.log('update(); event NOT found = ' +
                        JSON.stringify(event));
	            } else {
	                var eventobj = JSON.parse(JSON.stringify(List.Entries[index]));
	                var objects = RepeatObj.useList.objects;
	                for (var i = 0; i < objects.length; i++) {
	                    var obj = objects[i];
	                    var name = obj.name;
	                    RepeatObj.useList.checkAttr(obj, obj.value, 'output');
	                    var value = obj.value;
	                    if (typeof (name) === 'undefined'
                            ||
                            typeof (value) === 'undefined') { } else {
	                        eventobj[name] = value;
	                        console.log('update(); name=[' + name + '] value=[' + value + ']');
	                    }
	                }
	                try {
	                    if (eventobj['title'].length <= 0) {} else
	                    if (eventobj['backgroundColor'] === 'transparent') {
	                        eventobj['backgroundColor'] = '#000080';
	                    }
	                } catch (e) {
	                    console.log(e.toString());
	                }
	                function revert () {
	                    return (function (msg) {
	                        try {
	                            Controller.CurrentObj.changeState(obj, true);
	                            if (typeof (msg) === 'undefined') {
	                                msg = 'Not ready';
	                            }
	                        } catch (e) {}
	                        failure(msg);
	                    })
	                }
	                List.changeEvent(event, eventobj, revert());
	            }
	        });
	    }
	    update()();
	    return (ret);
	}
	List.Today = new moment();
	List.setDate = function (date) {
	    var mom = new moment(date);
	    if (mom.isValid()) {
	        List.Today = mom;
	    }
	    // List.calendar.fullCalendar('gotoDate', List.Today.format());
	}
	List.calendar = $(List.Id).fullCalendar(
	{
        now: "2010-01-01T00:00:00",
	    dayClick: function (date, jsEvent, view) {
	        console.log('dayClick=' + JSON.stringify(date));
	        if (List.nobounce == true
                &&
                AutoZoomObj.isDevice == true) {
	            List.nobounce = false;
	            createDefaultEvent(date, view);
	            window.setTimeout(function () {
	                List.nobounce = true;
	            }, 500);
	        }
	    },
	    eventMouseoverx: function (event, jsEvent, view) {
            console.log('eventMouseover=' + JSON.stringify(event));
            List.swallownextshift = true;
        },
        eventMouseoutx: function ( event, jsEvent, view ) {
            console.log('eventMouseover=' + JSON.stringify(event));
        },
        eventResize: function(event_in, delta, revertFunc) {
            var newevent = JSON.parse(JSON.stringify(event_in));
            var event = JSON.parse(JSON.stringify(event_in));
            var end = new appmom(event.end);
            console.log(event.title + " end is now " + end.format() + ' delta is [' + delta + ']');
            event.end = end.subtract(delta).format();
            List.changeEvent(event, newevent, revertFunc);
        },
        eventDrop: function (event_in, delta, revertFunc) {
            List.swallownextshift = true;
            var newevent = JSON.parse(JSON.stringify(event_in));
            var event = JSON.parse(JSON.stringify(event_in));
            var start = new appmom(event.start);
            var end = new appmom(event.end);
            console.log(event.title + " was dropped on " + start.format());
            event.start = start.subtract(delta).format();
            event.end = end.subtract(delta).format();
            List.changeEvent(event, newevent, revertFunc);
        },
	    events: function (start, end, timezone, callback) {
	        console.log('events(); length=[' + List.Entries.length + ']');
	        if (List.Entries.length > 0) {
	            callback(List.Entries);
	        } else {
	            //	            List.Entries = [];
	            List.Refresh = true;
	            List.Complete = callback;
	            if (List.Id === '#schedule') {
	                List.getData('/private/Schedule.json' + '?nocache=' + (new Date()).getTime());
	            } else {
	                List.getData('/private/Events.json' + '?nocache=' + (new Date()).getTime());
	            }
	        }
	    },
	    xyheader: false,
	    xnoheader: {
	        right: 'prev,next'
	    },
        allDaySlot: false,
	    loadingX: function (bool) { 
	    },
	    header: {
	        left: '',
			center: 'title',
			right: ''
		},
		/*
			defaultView option used to define which view to show by default,
			for example we have used agendaWeek.
		*/
		defaultView: 'agendaWeek',
		/*
			selectable:true will enable user to select datetime slot
			selectHelper will add helpers for selectable.
		*/
		selectable: true,
		selectHelper: true,
		selectLongPressDelay: 500,
		eventClick: function (event_in, jsEvent, view) {
		    var calEvent = JSON.parse(JSON.stringify(event_in));
		    if (List.nobounce == true) {
		        console.log('Event: ' + calEvent.title);
		        console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
		        console.log('View: ' + view.name);

		        // change the border color just for fun
		        //		    $(this).css('border-color', 'red');

		        var index = List.findEventIndex(calEvent);
		        if (index < 0) {
		            console.log('eventClick(); NOT found!');
		            console.log('calEvent=' + JSON.stringify(calEvent));
		        } else {
		            //		        List.Entries[index].borderColor = 'red';
		            //		        $(List.Id).fullCalendar('refetchEvents');
		            console.log('eventClick(); FOUND length=[' + List.Entries.length + '] event[' + index + ']=' + JSON.stringify(List.Entries[index]));
		        }
		        try {
		            Controller.editEvent(calEvent, function () {
		                alert('after edit init');
		            });
		        } catch (e) {
		            console.log(e.toString());
		        }
		        //		    calEvent.color = 'red';
		        //		    calEvent.borderColor = 'red';
		        //		    $(List.Id).fullCalendar('updateEvent', calEvent);

		        //		    console.log('calEvent=' + JSON.stringify(calEvent));

		    }
		},
        select: function (start_in, end_in, jsEvent, view) {
            var obj = new Object();
            var start = new moment(start_in);
            var end = new moment(end_in);
            // do not allow multiple day event
            if (start.format('L') !== end.format('L')
                &&
                (end.format('LT').indexOf('00:00') != 0
                &&
                end.format('LT').indexOf('12:00') != 0)) {
                console.log('same day [' + end.format('LT') + ']');
                var str = new String(start.format());
                createDefaultEvent(str.substr(0, 10), view);
            } else
            if (AutoZoomObj.isDevice == false) {
                createEvent(start, end);
            } else {
                console.log('select() ON DEVICE');
                createEvent(start, end);
            }
        },
		/*
			editable: true allow user to edit events.
		*/
		editable: true,
		/*
			events is the main option for calendar.
			for demo we have added predefined events in json object.
		*/
		eventsX: [
		],
		displayEventTime: false
	});
    try {
        var tables = document.getElementById('calendar').getElementsByTagName('table');
        JSON.stringify(tables);
    } catch (e) {
        console.log(e.toString());
    }
    List.calendar.fullCalendar('gotoDate', List.Today.format());
    return (List);
}

