// JavaScript source code
var AutoZoomObj = {
    isDevice: false,
    minDim: 732,
    maxRows: 3,
    zoomLev: 1.00
}
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('AutoZoom is set for device!')
    AutoZoomObj.isDevice = true;
}
$(function () {
    var fixedpixels = '940px';
    var innerfxpix = '935px';
    //     $('#NeoText').css('max-width', innerfxpix);
    //    $('#NeoText').css('min-width', innerfxpix);
    $('#divWrap').css('visibility', 'visible');
//    $('#divWrap').css('max-width', fixedpixels);
//    $('#divWrap').css('min-width', innerfxpix);
    CheckSizeZoom();
});

$(window).resize(CheckSizeZoom);

function CheckSizeZoom() {
    var minH = $(window).height();
    var minW = $(window).width();
    try {
        var height = Math.trunc(minH * 17 / 20);
        var width = Math.trunc(minW - (minW * 5 / 100));
        $('#calendar').fullCalendar('option', 'height', height);
        $('#calcontainer').height(height);
        $('#calcontainer').width(width);
        $('#map').height(height);
        $('#schedule').fullCalendar('option', 'height', height);
    } catch (e) {
        console.log(e.toString());
    }
    var windowmetric = $(window).height();
    AutoZoomObj.zoomLev = windowmetric / minH;
    //var msg = "min-width"
    //msg += $("[name='viewport']").val();
    //       alert(msg);
    console.log('CheckSizeZoom() ... [' +
        '] height=[' + $(window).height() +
        '] width=[' + $(window).width() +
        '] zoom=[' + AutoZoomObj.zoomLev +
        ']');
    RepeatObj.scroll();
    try {
        $("#Scope-Table").width($(window).width() * 94 / 100);
    } catch (e) {
        console.log(e.toString());
    }
    try {
        RepeatObj.Scope.processData(null);
    } catch (e) {
        console.log(e.toString());
    }
    try {
        var table = $("#Account-Table").height();
        var top = $("#Account-Form-Wrap").offset().top;
        var control = $("#Account-Data-Table").height();
        var height = ($(window).height() - top - control*2);
        if (height > (table + 5)) {
            height = (table + 5);
        }
        $("#Account-Form-Wrap").height(height);
    } catch (e) {
        console.log(e.toString());
    }
    return;
    if (typeof (document.body.style.zoom) != "undefined") {
        $(document.body).css('zoom', AutoZoomObj.zoomLev);
        console.log("zoom attribute!");
    }
    else
    if (windowmetric > minW) {
        //               alert("scale attribute");
        // Mozilla doesn't support zoom, use -moz-transform to scale and compensate for lost width
        $('#divWrap').css('-moz-transform', "scale(" + AutoZoomObj.zoomLev + ")");
        $('#divWrap').height($(window).height() / AutoZoomObj.zoomLev + 10);
        $('#divWrap').css('position', 'relative');
        $('#divWrap').css('left', (($(window).height() - minW - 16) / 2) + "px");
        $('#divWrap').css('top', "-19px");
        $('#divWrap').css('position', 'relative');
    } else {
        // alert("zoom minW < attribute");
        $(document.body).css('zoom', '');
        $('#divWrap').css('position', '');
        $('#divWrap').css('left', "");
        $('#divWrap').css('top', "");
        $('#divWrap').css('-moz-transform', "");
        $('#divWrap').width("");
    }
}