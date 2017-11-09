'use strict';

angular.module('translateam.subtitle', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/subtitle', {
    templateUrl: 'subtitle/subtitle.html',
    controller: 'SubtitleCtrl',
    controllerAs: 'SubCtrl'
  });
}])

.controller('SubtitleCtrl', ['$resource', '$location', function($resource, $location) {
  var self = this;
  self.subtitles = []
  self.videoCurrentTime = 100

  var Translation = $resource('/scenes/:sceneId/translations');

  // Get the current scene ID from the URL
  var sceneId = $location.search().scene || 1;

  Translation.query({sceneId: sceneId}).$promise.then(function(translations) {
    // Split the lines of the translation to make 
    var translation = translations[0];
    var lines = translation.text.split('\n');
    for (var i = lines.length - 1; i >= 0; i--) {
      self.subtitles.push({
        text: lines[i],
        start: null,
        end: null
      });
    }
  });
}]);
