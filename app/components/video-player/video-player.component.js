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
    $scope.videoDuration = 0;
    $scope.videoCurrentTime = 0;

    $scope.onTimeUpdate = function() {
      var video = $element.find('video')[0];
      $scope.videoCurrentTime = video.currentTime;
      $scope.$apply();
    }

    var video = $element.find('video')[0];
    video.addEventListener('loadedmetadata', function() {
      $scope.videoDuration = video.duration;
    });

    var wavesurfer = Object.create(WaveSurfer);
    wavesurfer.init({
      container: document.querySelector('#waveform'),
      waveColor: '#A8DBA8',
      progressColor: '#3B8686',
      backend: 'MediaElement',
      hideScrollbar: true
    });
    setTimeout(function() {
    var mediaElt = document.querySelector('video');
      wavesurfer.load($element.find('video')[0]);
    }, 100)

    $scope.playPause = function() {
      wavesurfer.playPause();
    }
  },
  link: function(scope, element) {
    var video = element.find('video');
    video.bind('timeupdate', scope.onTimeUpdate);
  }
}})
.filter('secondsToDateTime', [function() {
  return function(seconds) {
    return new Date(1970, 0, 1).setSeconds(seconds);
  }
}])
