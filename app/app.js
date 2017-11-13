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
 // $routeProvider.when('/', { templateUrl: 'view1', label: 'Home' })
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
