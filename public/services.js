
function addServicesList(name, file) {
    angular.bootstrap(document.getElementById("divWrap"), ['useApp']);
    RepeatObj.addList(name, file, function () {
        showService(name);
        function showService(name) {
            console.log(name + ' initialize(); complete');
            RepeatObj.useList.title = name;
            RepeatObj.useList.setActions({
                entry: {
                    Action: 'Done'
                }
            });
            RepeatObj.useList.initialize(name, true);
        }
    });
}
function ToolbarObj (tempid, key) {
    var listobj = ListDataObj(tempid);
    listobj.DataKey = key;
    listobj.addReferences = addReferences;
    listobj.listobj_processData = listobj.processData;
    listobj.processDatax = function (data) {
        listobj.listobj_processData(data);
        if ( typeof (listobj.addReferences) === 'undefined') { } else {
            listobj.addReferences();
            delete (listobj.addReferences);
        }
    }
    return (listobj);
}
function addListObj(tempid, jsonfilename, readyfunc) {
    var funcname = 'RepeatObj.addList()';
    var listobj = null;
    if ((listobj = ToolbarObj(tempid, RepeatObj.getDataKey(jsonfilename))) == null) {
        console.log(funcname + '(); Error in ' + funcname + '; unable to create ListObj');
    } else {
        console.log(funcname + '(); NEW [' + tempid + '] ListObj[' + listobj.DataKey + ']');
    }
    RepeatObj.addListObj(listobj, tempid, jsonfilename, readyfunc);
    return (listobj);
}
function addServices() {
   //restoreTemp(addServicesList);
   addServicesList('Service', '/data/Service.json');
}


