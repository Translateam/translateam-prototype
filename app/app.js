'use strict';

// Declare app level module which depends on views, and components
angular.module('translateam', [
  'ngRoute',
  'translateam.view1',
  'translateam.view2',
  'translateam.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
