'use strict';

// Declare app level module which depends on views, and components
angular.module('translateam', [
  'ngRoute',
  'ngResource',
  'translateam.view1',
  'translateam.view2',
  'translateam.subtitle',
  'translateam.version',
  'translateam.video-player',
  'translateam.help-dialog'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
