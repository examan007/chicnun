var UIRouterModule = angular.module('routerApp', ['ui.router']);
var UIRouter = null;
function execute_routerApp() {
    UIRouterModule.controller('UIRouterController', ['$scope', function ($scope) {
        UIRouter = this;
        UIRouter.scope = $scope;
        UIRouter.objects = [];
        UIRouter.options = [];
        UIRouter.getOptions = function (obj) {
            console.log('getOptions ' + JSON.stringify(obj));
            return (UIRouter.options[obj.Key]);
        }
        UIRouter.update = function () {
            try {
                UIRouter.scope.$apply();
                preventLongPressMenu(document.getElementsByTagName('div'));
                function preventLongPressMenu(nodes) {
                    for(var i=0; i<nodes.length; i++){
                        nodes[i].ontouchstart = absorbEvent_;
                        nodes[i].ontouchmove = absorbEvent_;
                        nodes[i].ontouchend = absorbEvent_;
                        nodes[i].ontouchcancel = absorbEvent_;
                    }
                }
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
                //console.log('setOptions(); options=' + JSON.stringify(obj));
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
            console.log('obj=' + JSON.stringify(obj));
            console.log('opt=' + JSON.stringify(opt));
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
    }]);
    optioncomp('search', '-Search')
    optioncomp('booking', '-Booking')
    optioncomp('account', '-Account')
    function optioncomp (objname, tagname) {
        UIRouterModule.component(objname, {
          template:  '',
          controller: function() {
            console.log('component[' + objname + ']');
            UIRouter.setOptions('-');
          }
        });
    }
    UIRouterModule.component('searchx', {
      template:  '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
                 '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',
           
      controller: function() {
        console.log('search');
        this.toggleGreeting = function() {
          this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
      }
    });
    UIRouterModule.component('bookingx', {
      bindings: { people: '<' },

      template: '<h3>Some people:</h3>' +
                '<ul>' +
                '  <li ng-repeat="person in $ctrl.people">' +
                '    <a ui-sref="person({ personId: person.id })">' +
                '      {{person.name}}' +
                '    </a>' +
                '  </li>' +
                '</ul>'
    })
    ParamObj.getParametersData( function () {
        var toolbar = RepeatObj.addList('uirouter', '/data/Toolbar.json', function () {
            console.log('toolbar=' + JSON.stringify(toolbar.DataMap.map));
            var dropdown = RepeatObj.addList('uioptions', '/data/Dropdown.json', function () {
                console.log('dropdown=' + JSON.stringify(dropdown.DataMap.map));
                UIRouter.initData(toolbar.DataMap.map, dropdown.DataMap.map);
            });
        });
    });
}
function config_routerApp() {
    console.log('config_routerApp(); ');
    UIRouterModule.config(function($stateProvider) {
        var searchState = {
            name: 'search',
            url: '/search',
            component: 'search'
        }
        var bookingState = {
            name: 'booking',
            url: '/booking',
            component: 'booking',
/*
            resolve: {
                people: function(PeopleService) {
                    return PeopleService.getAllPeople();
                }
            }
*/
        }
        var accountState = {
            name: 'account',
            url: '/account',
            // template: '<h3>Its the UI-Router hello world app!</h3>'
            component: 'account',
        }
          $stateProvider.state(searchState);
          $stateProvider.state(bookingState);
          $stateProvider.state(accountState);

    });
}
function addReferences() {
    var temp = document.getElementById('Toolbar-Option');
    if (temp == null) {} else
    try {
        var list = temp.parentNode.childNodes;
        for (var n = 0; n < list.length; n++) {
            var node = list[n];
            if (typeof(node.id) === 'undefined') {
                continue;
            }
            var args = node.id.split('-');
            if (args.length < 3) {
                continue;
            }
            var option = args[2].toLocaleLowerCase();
            var elements = node.getElementsByClassName('Toolbar-Button');
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute('ui-sref', option);
                elements[i].setAttribute('ui-sref-active', 'active');
                console.log('addServices(); ui-sref=[' + elements[i].getAttribute('ui-sref') + ']');
            }
            console.log('addServices(); option=[' + option + ']');
            console.log('addServices(); elements.length=[' + elements.length + ']');
        }
    } catch (e) {
        console.log('toolbar' + e.toString());
    }
    config_routerApp();
}

