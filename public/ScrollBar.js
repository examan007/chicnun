function Scroller(element) {
    var that = new Object();
    that.name = null;
    if (element == null) {
        alert('scrollController(); empty element received!');
    } else 
    if ((that.name = element.getAttribute('id')) == null) {
        alert('scrollController(); event from unknown id!');
    } else {
        var topval = '' + Math.round(element.scrollTop) + 'px';
        console.log('scrollController(); event from [' + that.name + '] scrollY=[' + topval + ']');
        $('#OS_Content').css('top', topval);//
    }
    that.element = element;
    that.headerrows = 6;
    that.page = 0;
    that.cursor = -1;
    that.lastscroll = '0';
    that.total = 0;
    that.Scope = null;
    that.Debug = 0;
    that.getTableRowHeight  = function (tableid) {
        var funcname = 'ScrollGovernor.getTableRowHeight';
        var rowheight = 10;
        var tbl = null;
        var tbody = null;
        var rows = null;
        if ((tbl = document.getElementById(tableid)) == null) {
            console.log(funcname + '(); cannot find [' + tableid + ']');
        } else
        if ((tbody = tbl.getElementsByTagName('tbody')) == null) {
            console.log(funcname + '(); cannot find [' + tableid + '.tbody]');
        } else
        if (tbody.length <= 0) {
            console.log(funcname + '(); no body in [' + tableid + '.tbody]');
        } else
        if ((rows = tbody[0].getElementsByTagName('tr')) == null) {
            console.log(funcname + '(); cannot find [' + tableid + '.tbody.tr]');
        } else
        if (rows.length <= 1) {
            console.log(funcname + '(); no rows in [' + tableid + '.tbody]');
        } else {
            rowheight = parseInt(rows[1].offsetHeight);
        }
        return (rowheight);
    }
    that.setBodyHeight = function (element, scroller) {
        var funcname = 'ScrollGovernor.setBodyHeight';
        var This = this;
        var name = null;
        var value = null;
        var rowheight = 0;
        if (element == null) {
            console.log('' + funcname + '(); Unable to set body height!');
        } else
        if ((name = element.getAttribute('id')) == null) {
            console.log('' + funcname + '(); Unable to get id!');
        } else
        if (empty(name)) {
            console.log('' + funcname + '(); Undefined id!');
        } else
        if ((rowheight = parseInt(this.getTableRowHeight('Scope-Table-Content'))) == 0) {
            alert('' + funcname + '(); rowheight=[0]!');
        } else {
            var maxrows = RepeatObj.getMaxRows(rowheight);
            This.page = maxrows;
            var initialheight = parseInt(maxrows * rowheight);
            var factor = 1; // (This.page + This.header) / This.page;
            //       alert(factor);
            try {
                This.total = this.Scope.DataMap.getLength();
            } catch (e) {
                console.log(e.toString());
            }
            console.log(funcname + '(); rowheight=[' + rowheight + '] initialheight=[' + initialheight + ']');
            console.log(funcname + '(); maxrows=[' + maxrows + '] total=[' + This.total + ']');
            var overrows = (This.total - maxrows)+1;
            var overheight = overrows * rowheight;
            var maxheight = overheight  + initialheight;
            var newheight = '' + (maxheight >= 0 ? maxheight : intialheight)  + 'px';
            var newpos = (This.cursor * rowheight);
            //        This.lastscroll = newpos;
            var name = element.getAttribute('id');
            if (empty(name))
            {
                name = 'NoId';
            }
            if (this.Debug > 1) {
                console.log(funcname + '(); rowheight=[' + rowheight + '] name=[' + name + '] new height=[' + newheight + '] new position=[' + newpos + '] old=[' + This.lastscroll + ']');
            }
            try {
                $('#Scope-Table-Scroll').height(initialheight - 40);
                $('#Scope-Table-Body').height(initialheight);
                $('#Scope-Table').height(initialheight + rowheight);
                This.Scope.MaxRows = maxrows;
            } catch (e) {
                console.log(e.toString());
            }
            var wrap = document.getElementById('Scope-Table-Scroll');
            if (maxheight > initialheight) {
                element.setAttribute('style', 'height:' + newheight);
                wrap.setAttribute('class', 'Scope-Table-Scroll-Active');
            } else {
                element.setAttribute('style', 'height:' + '0px');
                wrap.setAttribute('class', 'Scope-Table-Scroll-Hidden');
            }
        }
    }
    that.executeScroll = function (element) {
        var funcname = 'Scroller.executeScroll';
        var This = this;
        var rowheight = this.getTableRowHeight('Scope-Table-Content');
        if (rowheight == 0) {
            console.log('' + funcname + '(); rowheight=[0]!');
            return;
        }
        This.lastscroll = element.scrollTop;
        var newscroll = parseInt(element.scrollTop);
        var oldcursor = This.cursor;
        var newcursor = This.cursor;
        console.log('row=[' + rowheight + '] cusor=[' + This.cursor +
            '] new=[' + newscroll+ '] lastscroll=[' + This.lastscroll + ']');
        if (newscroll == 0) {
            newcursor = 0;
        } else
        if (newscroll < rowheight) {
            newcursor = 0;
        } else
        if (newscroll < rowheight * 2) {
            newcursor = Math.round((newscroll - rowheight) / rowheight) + 1;
        } else {
            newcursor = Math.round((newscroll - rowheight) / rowheight) + 2;
        }
        This.cursor = newcursor;
        console.log('CURSOR=[' + This.cursor + ']');
        this.setBodyHeight(document.getElementById('inner-content-div'), element);
        return (oldcursor == newcursor ? false : true);
    }
    return (that);
}
var ScrollGovernor = {
    classobj: 'ScrollGovernor',
    timeout: 100,
    nextupdate: 0,
    timer: null,
    elements: [],
    scrollers: {},
    showState: function () { },
    executeScrollElements: function () {
        var This = this;
        var ret = false
        var scroller = This.current;
        try {
            console.log('UPDATE=[' + scroller.cursor + ']');
            if (scroller.Scope != RepeatObj.Scope) {
                var name = '';
                var test = '';
                try {
                    name = scroller.Scope.Name + '-' + scroller.Scope.DataKey;
                    test = RepeatObj.Scope.Name + '-' + RepeatObj.Scope.DataKey;
                } catch (e) {}
                console.log('Do NOT execute scroller! name=[' + name + '] [' + test + ']');
            } else
            if (scroller.executeScroll(scroller.element) == true) {
                ret = true;
                if (RepeatObj.Scope == scroller.Scope) {
                    scroller.Scope.Cursor = scroller.cursor;
                    scroller.Scope.processData(null);
                }
            }
            console.log('DONE=[' + scroller.cursor + ']');
        } catch (e) {
            console.log(e.toString());
        }
        RepeatObj.writeElementCount();
        return (ret);
    },
    executeAfterPeriod: function (force) {
        var ret = false;
        var datemgr = new Date();
        var current = datemgr.getTime();
        console.log('governScroll(); current=[' + current + '] last=[' + this.nextupdate + ']');
        if (current > this.nextupdate || force == true) {
            if ((ret = this.executeScrollElements()) == true) {
                this.nextupdate = current + this.timeout;
            }
        }
        return (ret);
    },
    governScroll: function (element, flag) {
        var funcname = this.classobj + '.governScroll';
        var ret = this.executeAfterPeriod(flag);
        if (ret == false && flag == true) {
        } else
            if (this.timer == null) {
                this.timer = window.setTimeout(function () {
                    ScrollGovernor.timer = null;
                    ScrollGovernor.executeAfterPeriod(false);
                }, ScrollGovernor.timeout);
            }
    },
    registerScroll: function (id, filter, scope) {
        var funcname = this.classobj + '.registerScroll';
        var name = id + '-' + filter;
        var scroller = this.scrollers[name];
        if (typeof (scroller) === 'undefined') {
            console.log(funcname + '(); NEW name=[' + name + '] elements.length=[' + this.elements.length + ']');
            var scroller = new Scroller(document.getElementById(id));
            this.scrollers[name] = scroller;
        } else {
            console.log(funcname + '(); Existing name=[' + name + '] elements.length=[' + this.elements.length + ']');
            if (scroller.scope != scope) {
                console.log('New Scope with old Scroller!');
            }
        }
        scroller.Scope = scope;
        this.current = scroller;
    },
    stopCurrent: function () {
        var scroller = this.current;
        this.current = null;
    },
    deregisterScroll: function (id, filter) {
        var name = id + '-' + filter;
        try {
            var scroller = this.scroller[name];
            if (this.current == scroller) {
                this.current = null;
            }
            delete (this.scrollers[name]);

        } catch (e) {
            console.log(e.toString());
        }
    }
}
function empty(data) {
    if (typeof (data) == 'number' || typeof (data) == 'boolean') {
        return false;
    }
    if (typeof (data) == 'undefined' || data === null) {
        return true;
    }
    if (typeof (data.length) != 'undefined') {
        return (false); //data.length == 0;
    }
    var count = 0;
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            count++;
        }
    }
    return count == 0;
}
function scrollController(element) {
    try {
        ScrollGovernor.governScroll(element, false);
    } catch (e) {
        console.log(e.toString());
    }
}

