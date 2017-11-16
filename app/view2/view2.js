'use strict';

angular.module('translateam.view2', ['ngRoute','ui.router'])

.config(['$routeProvider','$stateProvider' ,function($routeProvider,$stateProvider) {
  $routeProvider.when('/view2/view2:idElement', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
 }])

.controller('View2Ctrl', ['$scope','$routeParams',function($scope,$routeParams) {
  $scope.idElement = $routeParams.idElement;
}]);
