function optobj (classname) {
    var obj = new Object();
    obj.classname = classname;
    obj.name = 'option';
    obj.preop = function (data, callback) {
        return (false);
    }
    obj.postop = function (data, callback) {
        return (false);
    }
    obj.operation = function (data, callback) {
        return (false);
    }
    return (obj);
}
function scopeobj(name) {
    var obj = new optobj('scopeobj');
    obj.name = name;
    var parms = new Object();
    try {
       parms = RepeatObj.Data['Selection'].DataMap.getEntry(name);
    } catch (e) {
        console.log(obj.classname + e.toString());
    }
    obj.preop = function (data, callback) {

        return (false);
    }
    obj.postop = function (data, callback) {

        return (false);
    }
    obj.operation = function (data, callback) {

        return (false);
    }
}
