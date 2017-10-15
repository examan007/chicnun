function OptionObj(classname) {
    console.log(classname + 'is constructing!');
    var option = new StateObj(classname);
    option.Entry = null;
    option.getControlObj = function () {
        var control = Controller.Controls[this.Parent.Name];
        return (control);
    }
    return (option);
}

function OptionStylist(classname) {
    var option = new OptionObj(classname);
    option.initialize = function (obj) {
        if (option.Parent == null) { } else {
            option.Parent.Option = option;
        }
        function execute(option) {
            var option = option
            return (function () {
                var obj = {
                    id: 'Dropdown-Option-' + option.Name,
                    selected: true
                }
                console.log(JSON.stringify(obj));
                Controller.setState(obj, option.Name);
//                Controller.select(obj);
            });
        }
        if (option.InitFlag == true) { } else {
            option.InitFlag = true;
            obj.executeselect = execute(this);
        }
    }
    option.terminate = function (obj) {
        option.InitFlag = false;
    }
    return (option);
}

function OptionSalon(classname) {
    var obj = new OptionStylist(classname);
    return (obj);
}

function OptionClient(classname) {
    var obj = new OptionStylist(classname);
    return (obj);
}

function OptionToday(classname) {
    var option = new OptionObj(classname);
    option.InitFlag = false;
    option.uberkey = classname.toString();
    option.initialize = function (obj) {
        function execute(obj) {
            var option = obj;
            return (function () {
                try {
                    var cal = option.getControlObj().Calendar;
                    cal.Today = new moment();
                    cal.setDate(cal.Today);
                } catch (e) {
                    console.log(this.Classname + e.toString());
                }
            });
        }
        if (option.InitFlag == true) { } else {
            option.InitFlag = true;
            obj.executeselect = execute(this);
        }
        obj.executeoption = function () {
            $('#schedule').fullCalendar('changeView', 'agendaDay');
            SUNCal.installTracker();
        }
    }
    option.terminate = function (obj) {
        SUNCal.removeTracker();
        option.InitFlag = false;
    }
    option.uber_initialize = option.initialize;
    option.uber_terminate = option.terminate;
    return (option);
}

function OptionWeek(classname) {
    var option = new OptionToday(classname);
    option.initialize = function (obj) {
        option.uber_initialize(obj);
        obj.executeoption = function () {
            $('#schedule').fullCalendar('changeView', 'agendaWeek');
            SUNCal.installTracker();
        }
    }
    option.terminate = function (obj) {
        SUNCal.removeTracker();
        option.uber_terminate(obj);
        //alert('terminate');
     }
    return (option);
}

function OptionMonth(classname) {
    var option = new OptionToday(classname);
    option.initialize = function (obj) {
        $('#schedule').hide();
        option.uber_initialize(obj);
    }
    option.terminate = function (obj) {
        option.uber_terminate(obj);
        $('#schedule').show();
    }
    return (option);
}

function OptionList(classname) {
    var obj = new OptionObj(classname);
    return (obj);
}

var NeedAuthentication = true;
function OptionLoginBase(classname) {
    var option = new OptionObj(classname);
    option.execute = function (obj) {
        var option = obj;
        return (function () {
            try {
                Controller.setClassName('smallname');
                if (option.Entry == null) { } else {
                    console.log(option.Classname + JSON.stringify(option.Entry));
                    RepeatObj.useList.setActions(option.Entry);
                    RepeatObj.useList.initialize(option.Name, true);
                }
            } catch (e) {
                console.log(option.Classname + e.toString());
            }
        });
    }
    option.initialize = function (obj) {
        if (option.InitFlag == true
            ||
            (NeedAuthentication == true
            &&
            Controller.UserId > 0)) { } else {
            option.InitFlag = true;
            if (obj.executeselect != null) { } else {
                obj.executeselect = option.execute(option);
            }
        }
    }
    option.terminate = function (obj) {
        option.InitFlag = false;
        console.log('terminate() classname=[' + option.Classname + ' obj=' + JSON.stringify(obj));
    }
    return (option);
}

function OptionLogin(classname) {
    var option = new OptionLoginBase(classname);
    option.login_initialize = option.initialize;
    option.initialize = function (obj) {
        NeedAuthentication = false;
        option.login_initialize(obj);
        NeedAuthentication = true;
        console.log(option.Classname + JSON.stringify(option.Entry));
    }
    option.uber_terminate = option.terminate;
    option.terminate = function (obj) {
        option.uber_terminate(obj);
    }
    return (option);
}

function OptionNew(classname) {
    var option = new OptionLoginBase(classname);
    option.initialize = function (obj) {
        if (obj.executeselect != null) { } else {
            obj.executeselect = option.execute(option);
        }
    }
    return (option);
}

function OptionEdit(classname) {
    var option = new OptionLoginBase(classname);
    option.data = null;
    option.enabled = false;
    option.elementids = [];
    option.filename = 'User.json'
    option.initialize = function (obj) {
        function execute(obj) {
            var option = obj;
            return (function (data) {
                if (data == null) {
                    data = {};
                }
                if (option.enabled == false) {
                    function testobj(obj) {
                        var ret = false;
                        if (typeof (obj.helptext) === 'undefined') { } else
                            if (typeof (obj.alttext) === 'undefined') { } else {
                                ret = true;
                            }
                        return (ret);
                    }
                    function swaptext(obj, name, element) {
                        try {
                            if (obj.name !== name) { } else
                            if (testobj(obj) == false) { } else {
                                if (obj.value === "false") {
                                    obj.value = "true";
                                } else
                                if (obj.value === "true") {
                                    obj.value = "false";
                                } else {
                                    obj.value = "true";
                                }
                                if (element == null) { } else {
                                    element.value = obj.value;
                                }
                                console.log(JSON.stringify(obj));
                            }
                        } catch (e) { }
                    }
                    function execute(element) {
                        var id = element.id;
                        var name = id.split('-')[2];
                        console.log(id);
                        $.each(RepeatObj.useList.objects, function (index, obj) {
                            swaptext(obj, name, element);
                        });
                        RepeatObj.useList.update();
                    }
                    function install(tag) {
                        var name = tag.split('-')[2];
                        $(tag).mousedown(function (event) {
                            var input = document.getElementById('Account-Input-' + name);
                            try {
                                execute(input);
                                $("#Account-Input-Name").focus();
                            } catch (e) { }
                        });
                        option.enabled = true;
                    }
                    option.elementids = [];
                    $.each(RepeatObj.useList.objects, function (index, obj) {
                        if (testobj(obj) == false) { } else {
                            var id = '#Account-Text-' + obj.name;
                            option.elementids.push(id);
                            install(id);
                        }
                    });
                }
                RepeatObj.useList.addData(data);
                RepeatObj.useList.initialize(option.Name, true);
            });
        }
        function getobject(obj) {
            var option = obj;
            var filename = Controller.PrivateDir + option.filename;
            console.log('execute(); filename=[' + filename + '] userid=[' + option.userid + ']');
            option.execute(option) ();
            return (function () {
                try {
                    if (option.data.UserId == Controller.UserId) {
                        execute(option)(option.data);
                    } else {
                        option.getData(filename, execute(option));
                    }
                } catch (e) {
                    option.getData(filename, execute(option));
                }
            });
        }
        if (obj.executeselect != null) { } else {
            obj.executeselect = getobject(option);
        }
        RepeatObj.useList.checkcomplete = function (flag, fields, status) {
            var funcname = option.Classname + '.checkcomplete';
            var ret = status;
            console.log(funcname + '() flag=[' + flag + '] ret=[' + ret + ']');
            return (ret);
        }
    }
    option.getData = function (jsonfilename, callback) {
        var username = Controller.UserId;
        var password = Controller.Password;
        function setHeader(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
        $.ajax({
            url: jsonfilename,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                callback(data); 
            },
            error: function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err + ' filename=[' + jsonfilename + ']');
                callback(null);
            },
            beforeSend: setHeader
        });
    }
    option.terminate = function (obj) {
        $(option.elementids[0]).unbind('mousedown');
        option.enabled = false;
        RepeatObj.useList.checkcomplete = null;
        option.InitFlag = false;
        console.log('terminate() classname=[' + option.Classname + ' obj=' + JSON.stringify(obj));
        RepeatObj.useList.addData(null);
        RepeatObj.useList.clearObjects(true);
    }
    return (option);
}
function OptionEvent(classname) {
    var option = new OptionEdit(classname);
    option.filename = 'Event.json';
    option.getData = function (jsonfilename, callback) {
        callback(Controller.CurrentEvent);
    }
    return (option);
}
function OptionService(classname) {
    var option = new OptionEdit(classname);
    option.filename = 'Service.json';
    option.edit_initialize = option.initialize;
    option.initialize = function (obj) {
        option.edit_initialize(obj);
        function service(obj) {
            var complete = obj.executeselect;
            return (function () {
                if (complete == null) { } else {
                    complete();
                    console.log('complete' + JSON.stringify(obj));
                    RepeatObj.useList.executeservice = function () {
                        try {
                            $('#Booking').hide();
                            $('#Account').show();
                            console.log('Controller.executeservice' + JSON.stringify(obj));
                        } catch (e) {
                            alert(e.toString());
                        }
                    }
                }
            })
        }
        // obj.executeselect = service(obj);
    }
    return (option);
}

