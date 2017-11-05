var UIRouterModule = angular.module('routerApp', ['ui.router']);
var UIRouter = null;
function execute_routerApp() {
    UIRouterModule.controller('UIRouterController', ['$scope', function ($scope) {
        UIRouter = this;
        UIRouter.objects = []
        UIRouter.update = function (map) {
            UIRouter.objects = map;
            try {
                console.log('before triggerHandler');
                var element = angular.element('#UIRouterUpdate');
                element.triggerHandler('click');
                console.log('done triggerHandler');
            } catch (e) {
                console.log(e);
            }
            $scope.load = function () {

            }
        }
    }]);
    UIRouterModule.component('search', {
      template:  '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
                 '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',
           
      controller: function() {
        this.greeting = 'hello';
        console.log('hello');
        this.toggleGreeting = function() {
          this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        }
      }
    });
    UIRouterModule.component('booking', {
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
            resolve: {
                people: function(PeopleService) {
                    return PeopleService.getAllPeople();
                }
            }
        }
        var accountState = {
            name: 'account',
            url: '/account',
            template: '<h3>Its the UI-Router hello world app!</h3>'
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

