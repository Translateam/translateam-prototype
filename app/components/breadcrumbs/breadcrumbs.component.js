'use strict';

angular.module('translateam.breadcrumbs', [])

.directive('breadcrumbs', function($location, $routeParams) {
  return {
    templateUrl: 'components/breadcrumbs/breadcrumbs.template.html',
    transclude: true,
    controller: function($scope) {
      $scope.sceneType = function() {
        var path = $location.path().substr(1).split('/')[0]
        switch(path) {
          case 'transcribe':
            return 'Transcribe';
          case 'translate':
            return 'Translate';
          case 'subtitle':
            return 'Subtitle';
          default:
            return ''
        }
      }
      $scope.sceneNumber = function() {
        return $routeParams.sceneId
      };

      $scope.returnToProjectPage = function() {
        $location.path('/view1');
      }
    }
}})
