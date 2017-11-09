'use strict';

angular.module('translateam.video-player', [])

.directive('videoPlayer', function() {
  return {
	templateUrl: 'components/video-player/video-player.template.html',
  bindings: {
    videoUrl: '@',
    videoCurrentTime: '='
  },
  scope: {
    videoUrl: '@videoUrl',
    videoCurrentTime: '=videoCurrentTime'
  },
  controller: function($scope, $element) {
    console.log($element);
    $scope.onTimeUpdate = function() {
      var video = $element.find('video')[0];
      $scope.videoCurrentTime = video.currentTime;
      $scope.$apply();
    }
  },
  link: function(scope, element) {
    var video = element.find('video');
    video.bind('timeupdate', scope.onTimeUpdate);
  }
}})
