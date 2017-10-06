// JavaScript source code
// Get the modal
function ModalObj(id) {
    this.modal = document.getElementById(id);
    this.hide = function () {
        this.modal.style.display = "none";
    }
    this.setText = function (message) {
        this.modal.style.display = "block";
        var ps = this.modal.getElementsByTagName('p');
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
    this.showEntry = function (entry, names) {
        if (this.modal.style.display === "block") {
            return;
        }
        this.modal.style.display = "block";
        var ps = this.modal.getElementsByTagName('p');
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
}

ModalInstance = new ModalObj('myModal');

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


