'use strict';

// Declare app level module which depends on views, and components
angular.module('translateam', [
  'ngRoute',
  'ngResource',
  'ncy-angular-breadcrumb',
  'ui.router',
  'translateam.view1',
  'translateam.view2',
  'translateam.subtitle',
  'translateam.translate',
  'translateam.version',
  'translateam.video-player',
  'translateam.help-dialog'
]).
config(['$locationProvider', '$routeProvider', '$stateProvider', '$breadcrumbProvider', function($locationProvider, $routeProvider, $stateProvider,$breadcrumbProvider) {
  $locationProvider.hashPrefix('!');
  var states = [
    {
      name: 'view1',
      url: '/view1/view1',
      templateUrl: '/view1/view1.html',
      ncyBreadcrumb: {
        label: 'Translateam Project'
      }
    },
    {
      name: 'view2',
      url: '/view2/view2:idElement',
      templateUrl: '/view2/view2.html',
      controller: 'View2Ctrl',
      ncyBreadcrumb: {
        label: '/Episode {{idElement}}',
        parent: 'view1'
      }
    }

  ];

  states.forEach($stateProvider.state);

  $routeProvider.otherwise('/view1');

  $breadcrumbProvider.setOptions({
    template: '<ol class="breadcrumb" ng-init="routes = ' + JSON.stringify(states).replace(/"/g, "'") + '">' +
    '<li ng-repeat="route in routes" ng-switch="step = (route | routeActive:steps)">' +
    '<span ng-switch-when="false">{{route.ncyBreadcrumb.label}}</span>' +
    '<a ng-switch-default href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
    '</li>' +
    '</ol>'
  })

}])

// The scope of the ncyBreadcrumb directive is isolated.
// Filter is the only way to provide a function returning the step
// corresponding to the route or false if no step has been founded.
  .filter('routeActive', function($state, $breadcrumb) {
    return function(route, steps) {
      for(var i = 0, j = steps.length; i < j; i++) {
        if(steps[i].name === route.name) {
          return steps[i];
        }
      }

      return false;
    };
  })
  // .controller('View2Ctrl','$stateProvider', function($scope, $stateParams){
  //   $scope.idElement = $stateParams.idElement;
  // });


