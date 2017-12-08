var UIRouterModule = angular.module('routerApp', ['ui.router']);
var UIRouter = null;
var UIRToolbar = null;
var UIRDropdown = null;
function execute_routerApp() {
    UIRouterModule.controller('UIRouterController', ['$scope', function ($scope) {
        UIRouter = this;
        UIRouter.scope = $scope;
        UIRouter.objects = [];
        UIRouter.options = [];
        UIRouter.ActiveObj = 'default';
        UIRouter.Current = 'default';
        UIRouter.getOptions = function (obj) {
            console.log('getOptions ' + JSON.stringify(obj));
            return (UIRouter.options[obj.Key]);
        }
        UIRouter.update = function () {
            try {
                UIRouter.scope.$apply();
            } catch (e) {
                console.log(e);
            }
        }
        UIRouter.initData = function (objmap, optmap) {
            UIRouter.objects = objmap;
            UIRouter.options = [];
            optmap.forEach( function (option) {
                if (typeof(option.Operation) === 'undefined') { } else {
                    var operation = option.Operation.substr(1);
                    console.log('initData operation=[' + operation + '] ' + JSON.stringify(option));
                    if (typeof(UIRouter.options[operation]) === 'undefined') {
                        UIRouter.options[operation] = [];
                    }
                    UIRouter.options[operation].push(option);
                }
            });
            UIRouter.update();
        }
        UIRouter.setOptions =  function (objname) {
            for (obj in UIRouter.options) {
                // console.log('setOptions(); options=' + JSON.stringify(obj));
                UIRouter.options[obj].forEach( function (option) {
                    try {
                        var tag = '#Option' + option.Operation + '-' + option.Key;
                        // console.log('setOptions(); tag=[' + tag + ']');
                        if (objname !== option.Operation) {
                            $(tag).hide();
                        } else
                        if (option.Filter === 'hidden') {
                            $(tag).hide();
                        } else {
                            $(tag).show();
                        }
                    } catch (e) {
                        console.log('setOptions ' + e.toString());
                    }
                });
            }
        }
        UIRouter.select = function (obj, opt) {
 //           console.log('obj=' + JSON.stringify(obj));
 //           console.log('opt=' + JSON.stringify(opt));
            UIRouter.setOptions('-' + obj.Key);
        }
        UIRouter.execopt = function (obj, opt, flag) {
            console.log('obj=' + JSON.stringify(obj));
            console.log('opt=' + JSON.stringify(opt));
        }
        UIRouter.CheckState = '';
        UIRouter.checkClick=  function (event, obj) {
            if (AutoZoomObj.isDevice == false) { } else
            if (obj.Key === UIRouter.CheckState) { } else {
                event.preventDefault();
                UIRouter.CheckState = obj.Key;
            }
        }
        UIRouter.initializeComplete = function () {
            initialize()();
            function initialize() {
                return (function () {
                    UIRouter.initData(UIRToolbar.DataMap.map, UIRDropdown.DataMap.map);
                    run();
                    function run() {
                        angular.bootstrap(document.getElementById("Account"), ['useApp']);
                        Application.initialize();
                        Controller.startApp();
                    }    
                });
            }
        }
    }]);
}
function startApplication() {
    ParamObj.getParametersData( function () {
        UIRToolbar = RepeatObj.addList('uirouter', '/data/Toolbar.json', function () {
            console.log('toolbar=' + JSON.stringify(UIRToolbar.DataMap.map));
            Controller.readyToolbar();
            UIRDropdown = RepeatObj.addList('uioptions', '/data/Dropdown.json', function () {
                Controller.readyToolbar();
                console.log('dropdown=' + JSON.stringify(UIRDropdown.DataMap.map));
                function initializeComplete() {
                    return (function () {
                        UIRouter.initializeComplete();
                    });
                }
                window.setTimeout(initializeComplete(), 3000);
            });
        });
    });
    execute_routerApp();
    config_routerApp();
//    addServices();
}
function config_routerApp() {
    console.log('config_routerApp(); ');
    function construct(name, parent) {
        optioncomp(name, 
            controller(name, '-' + parent.charAt(0).toUpperCase() + parent.substr(1)));
        return ({
            name: name,
            url: '/' + parent + '/' + name,
            component: name,
        });
    }
    function create(name) {
        var obj = construct(name, name);
        obj.url = '/' + name;
        return (obj);
    }
    states = [
        create('search'),
        create('booking'),
        create('account'),
        construct('stylist', 'search'),
        construct('client', 'search'),
        construct('salon', 'search'),
        construct('event', 'booking'), 
        construct('service', 'booking'),
        construct('today', 'booking'),
        construct('week', 'booking'),
        construct('month', 'booking'),
        construct('list', 'booking'),
        construct('login', 'account'),
        construct('edit', 'account'),
        construct('new', 'account')
    ];
    function controller(objname, tagname) {
        return (function () {
            console.log('component[' + objname + ']');
            try {
                var entry = null;
                if ((entry = UIRDropdown.DataMap.getEntryWithKey(objname, 'Name')) != null) {
                    console.log('entry=' + JSON.stringify(entry));
                    Controller.select({
                        id: 'Dropdown-Option-' + entry.Key,
                        selected: true
                    });
                } else 
                if ((entry = UIRToolbar.DataMap.getEntryWithKey(objname, 'Name')) != null) {
                    console.log('entry=' + JSON.stringify(entry));
                    Controller.select({
                        id: 'Toolbar-Option' + tagname,
                        selected: true
                    });
                } else {
                }
            } catch (e) {
                console.log('controller=' + e.toString());
            }
            try {
                $(UIRouter.ActiveObj).removeClass('activeobj');
            } catch (e) {
                console.log('remove' + e.toString());
            }
            var tag = '#' + 'Toolbar-Button' + tagname;
            console.log('tag=[' + tag + ']');
            try {
                $(tag).addClass('activeobj');
                UIRouter.ActiveObj = tag;
            } catch (e) {
                console.log('add' + e.toString());
            }
            UIRouter.setOptions('-');
        });
    }
    function optioncomp (objname, cntrlfunc) {
        console.log('optioncomp objname=[' + objname + ']');
        UIRouterModule.component(objname, {
          template:  '',
          controller: cntrlfunc
        });
    }
    UIRouterModule.config(function($stateProvider) {
        states.forEach( function (state) {
            $stateProvider.state(state);
        });
    });
}

