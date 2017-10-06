var SUNCal = {
    Instances: [],
    Schedule: null,
    findCalTable: function (idtag) {
        var table = null;
        try {
            table = findTable($(idtag)[0]);
            function findTable(node) {
                var table = null;
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if ((table = findTable(child)) == null) { } else {
                        break;
                    }
                    // alert(child.nodeName);
                    var e = $(child);
                    if (e.css('overflow-y') == 'scroll' || e.css('overflow-y') == 'auto') {
                        // alert('found table [' + idtag + ']' + JSON.stringify(e));
                        table = child;
                        break;
                    }
                    if (child.nodeName === 'TABLE') {
                        // alert('found table [' + idtag + ']');
                        // table = child;
                        // break;
                    } 
                }
                return (table);
            }
        } catch (e) {
            alert(e.toString());
        }
        return (table);
    },
    IDCalTag: '#calendar',
    IDSchTag: '#schedule',
    Installed: false,
    installTracker: function () {
        function install(table) {
            var cal = table;
            var sch = SUNCal.findCalTable(SUNCal.IDSchTag);
            return (function () {
                if (sch == null) {
                    sch = SUNCal.findCalTable(SUNCal.IDSchTag);
                }
                // console.log($(cal).scrollTop());
                $(sch).scrollTop($(cal).scrollTop());
            });
        }
        var table = SUNCal.findCalTable(SUNCal.IDCalTag);
        if (table == null) { } else {
            // alert('installTracker(); table=[' + table.nodeName + ']');
            $(table).on("scroll", install(table));
            SUNCal.Installed = true;
        }
    },
    removeTracker: function () {
        if (SUNCal.Installed == false) { } else {
            SUNCal.Installed = false;
            var table = SUNCal.findCalTable(SUNCal.IDCalTag);
            if (table == null) { } else {
                $(table).off("scroll");
            }
        }
    }
}

$(document).ready(function () {
    return;

    SUNCal.Schedule = EventListObj('#schedule');
    function defcal() {
        var swipe = AutoZoomObj.isDevice == true ? '' : 'prev,next'
        SUNCal.Schedule.calendar = $('#schedule').fullCalendar({
            now: "2010-01-01T00:00:00",
            theme: true,
            header: {
                left: '',
                center: 'title',
                right: swipe
            },
            allDaySlot: false,
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: [
            ],
            displayEventTime: false,
            defaultView: 'agendaWeek',
            columnFormat: 'ddd'

        });
    }
//    defcal();
    try {
        SUNCal.Schedule.calendar.fullCalendar('gotoDate', moment().format());
    } catch (e) {
        alert(e.toString());
    }

});

