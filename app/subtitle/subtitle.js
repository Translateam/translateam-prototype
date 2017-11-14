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

  var Translation = $resource('/scenes/:sceneId/translations');
  var Scene = $resource('/scenes/:sceneId');
  var Subtitle = $resource('http://localhost:3000/scenes/:sceneId/subtitles');
  var SubtitleUpdate = $resource('http://localhost:3000/subtitles/:subtitleId',
    null,
    {
      update: {method: 'PUT'}
    });

  self.subtitles = null;
  self.videoCurrentTime = 0
  self.videoUrl = ''

  // Get the current scene ID from the URL
  var sceneId = $location.search().scene || 1;

  // Get the current scene in order to grab the video URL
  Scene.get({sceneId: sceneId}).$promise.then(function(scene) {
    if(scene) {
      self.videoUrl = scene.videoUrl
      console.log(self.videoUrl)
    }
  })

  // See if any subtitle entities already exist
  Subtitle.query({sceneId: sceneId}).$promise.then(function(subtitles) {
    if(subtitles.length) {
      self.subtitles = subtitles[0];
    } else {
      // If no subtitles exist yet, use the translation to create them
      Translation.query({sceneId: sceneId}).$promise.then(function(translations) {
        // Split the lines of the translation to make the subtitles
        var s = new Subtitle({sceneId: sceneId});

        var translation = translations[0];
        var lines = translation.text.split('\n');
        var subs = []
        for (var i = 0; i < lines.length; i++) {
          subs.push({
            text: lines[i],
            start: null,
            end: null
          });
        }
        s.subs = subs;
        self.subtitles = s;
        s.$save({sceneId: sceneId});
      });
    }
  });

  /**
   * Gets the current subtitle text that should be displayed
   * over the video based on the current timestamp.
   */
  self.getCurrentSubtitle = function() {
    if(!self.subtitles) {
      return '';
    }
    for (var i = self.subtitles.subs.length - 1; i >= 0; i--) {
      var curr = self.subtitles.subs[i];
      if(curr.start !== null && curr.end !== null &&
        self.videoCurrentTime >= curr.start && self.videoCurrentTime <= curr.end) {
        return curr.text;
      }
    }
    return '';
  };

  /**
   * Sets the start or end timestamp of a subtitle to the current
   * video time.
   */
  self.setTimeStamp = function(sub, property) {
    sub[property] = self.videoCurrentTime;
  }

  /**
   * Saves the translation
   */
  self.saveAndClose = function() {
    SubtitleUpdate.update({subtitleId: self.subtitles.id}, self.subtitles);
    // TODO return to the project page
  };
}]);
