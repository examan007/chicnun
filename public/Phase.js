
function PhaseObj(classname) {
    var obj = new StateObj(classname);
    obj.Parent = Application.CurrentControl;
    obj.initialize = function (obj) {
        console.log(this.Classname + '.initialize');
    }
    obj.process = function (obj) {
        console.log(this.Classname + '.process');
    }
    obj.terminate = function (obj) {
        console.log(this.Classname + '.terminate ');
    }
    return (obj);
}
function PhaseSelection(classname) {
    var obj = new PhaseObj(classname);
    return (obj);
}
function PhaseScope(classname) {
    var obj = new PhaseObj(classname);
    return (obj);
}
function PhaseAction(classname) {
    var obj = new PhaseObj(classname);
    return (obj);
}
function executePhase(pobj) {
    var phase = pobj;
    var option = Application.CurrentControl.Name;
    var name = (option === 'Edit' ? 'Account-' + option : 'Booking');
    var id = 'Toolbar-Option-' + name;
    return (function () {
        // alert('executePhase');
        try {
            Controller.select({
                id: id,
                selected: true
            });
        } catch (e) {
            console.log(phase.Classname + e.toString());
        }
    });
}
function PhaseSave(classname) {
    var phase = new PhaseObj(classname);
    phase.initiate = function (obj) {
        var mom = new moment();
        RepeatObj.useList.updateObj = {
            key: 'create',
            value: mom.format()
        }
        RepeatObj.useList.operation = 'SaveUser';
        RepeatObj.useList.sequence = Application.CurrentControl.sequence;
        if (typeof (Controller.CurrentObj.Calendar) === 'undefined') { } else {
            Controller.CurrentObj.Calendar.savecomplete = executePhase(phase);
        }
        return (false);
    }
    return (phase);
}
function PhaseCreate(classname) {
    var phase = new PhaseObj(classname);
    phase.initiate = function (obj) {
        console.log('phase.initiate(); executing...!')
        var mom = new moment();
        RepeatObj.useList.updateObj = {
            key: 'create',
            value: mom.format()
        }
        return (false);
    }
    return (phase);
}
function PhaseBack(classname) {
    var phase = new PhaseObj(classname);
    phase.initiate = function (obj) {
        console.log(phase.Classname + '.initiate');
        RepeatObj.useList.cancel = executePhase(phase);
        return (false);
    }
    return (phase);
}
function PhaseCancel(classname) {
    var phase = new PhaseObj(classname);
    phase.initiate = function (obj) {
        obj.savecomplete = executePhase(phase);
        return (false);
    }
    return (phase);
}
