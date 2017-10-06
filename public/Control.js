function ControlBaseObj(classname) {
    var control = new StateObj(classname);
    var Option = null;
    control.initialize = function (obj) {
        if (control.Option == null) { } else {
            control.Option.initialize(obj);
        }
    }
    return (control);
}

function ControlSearch(classname) {
    var obj = new ControlBaseObj(classname);
    return (obj);
}

function ControlBooking(classname) {
    var option = new ControlBaseObj(classname);
    option.su_initialize = option.initialize;
    option.initialize = function (obj) {
        option.su_initialize(obj);
    }
    return (option);
}

function ControlAccount(classname) {
    var obj = new ControlBaseObj(classname);
    return (obj);
}


