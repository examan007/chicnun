// JavaScript source code
// Get the modal
function ModalObj(id) { 
    var obj = {};
    obj.id = id;
    obj.modal = document.getElementById(id);
    if (obj.modal == null) {
        console.log('ModalObj does not find id=[' + id + ']');
    }
    obj.hide = function () {
        obj.modal.style.display = "none";
    }
    obj.show = function () {
        obj.modal.style.display = "block";
    }
    obj.setText = function (message) {
        obj.modal.style.display = "block";
        obj.modal.style.zIndex = 100;
        var ps = obj.modal.getElementsByTagName('p');
        for (var n = 0; n < ps.length; n++) {
            var elements = ps[n].childNodes;
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.nodeName === "#text") {
                    element.textContent = message;
                }
            }
        }
    }
    obj.showEntry = function (entry, names) {
        if (obj.modal.style.display === "block") {
            return;
        }
        obj.modal.style.display = "block";
        var ps = obj.modal.getElementsByTagName('p');
        for (var n = 0; n < ps.length; n++) {
            var elements = ps[n].childNodes;
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.nodeName === "#text") {
                    element.textContent = entry[names[n]];
                }
            }
        }
    }
    try {
        var id = obj.id + '-close';
        console.log('ModalObj id=[' + id + ']');
        var span = document.getElementById(id);
        span.onclick = function () {
            obj.hide();
            RepeatObj.useList.results = [];
        }
    } catch (e) {
        console.log('ModalObj' + e.toString());
    }
    return (obj);
}
var ModalInstance = new ModalObj('myModal');
function myModal() {
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        GoogleAPI.selectMarker(null);
    }
    span.mouseover = function () {
        GoogleAPI.selectMarker(null);
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == ModalInstance.modal) {
            GoogleAPI.selectMarker(null);
        }
    }
    window.mouseover = function (event) {
        if (event.target == ModalInstance.modal) {
            GoogleAPI.selectMarker(null);
        }
    }
}
try {
    if (ModalInstance.modal == null) {} else {
        myModal();
    }
} catch (e) {
    console.log(e.toString());
}

