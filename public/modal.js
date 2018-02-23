function ModalObj(id, actions) { 
    var obj = {};
    obj.id = id;
    obj.modal = document.getElementById(id);
    if (obj.modal == null) {
        console.log('ModalObj does not find id=[' + id + ']');
    } else
    if (typeof(actions) === 'undefined' || actions.length == 0) {
    } else
    for (var i = 0; i < actions.length; i++) {
        initButton(actions[i].prefix, actions[i].method)
    }
    obj.hide = function () {
        obj.modal.style.display = "none";
    }
    obj.show = function () {
        obj.modal.style.display = "block";
    }
    function initButton(prefix, method) {
        try {
            var id = obj.id + '-close';
            console.log('ModalObj id=[' + id + ']');
            var span = document.getElementById(id);
            span.onclick = method;
        } catch (e) {
            console.log('ModalObj' + e.toString());
        }
    }

    return (obj);
}
