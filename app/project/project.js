'use strict';

angular.module('translateam.project', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/project', {
    templateUrl: 'project/project.html',
    controller: 'ProjectCtrl'
  });
}])

.controller('ProjectCtrl', ['$resource', '$location', '$scope', function($resource, $location, $scope) {
  $scope.scene1todo = [];
  $scope.scene1transcribe = [];
  $scope.scene1translate = [];
  $scope.scene1subtitle = [];
  $scope.scene1done = [];

  $scope.scene2todo = [];
  $scope.scene2transcribe = [];
  $scope.scene2translate = [];
  $scope.scene2subtitle = [];
  $scope.scene2done = [];

  $scope.scene3todo = [];
  $scope.scene3transcribe = [];
  $scope.scene3translate = [];
  $scope.scene3subtitle = [];
  $scope.scene3done = [];

  $scope.scene4todo = [];
  $scope.scene4transcribe = [];
  $scope.scene4translate = [];
  $scope.scene4subtitle = [];
  $scope.scene4done = [];

  var self = this;
  var Project = $resource('/projects/:projectId');
  var Scenes = $resource('/scenes/:sceneId');
  var ProjectScenes = $resource('http://localhost:3000/projects/:projectId/scenes');
  var SceneStageUpdate = $resource('http://localhost:3000/scenes/:sceneId',
    null,
    {
      update: {method: 'PUT'}
    });

  var projectId = $location.search().project || 1;
  var staticSceneIds = [1, 2, 3, 4];
  var projectId = 1;

  Project.get({projectId: projectId}).$promise.then(function(project) {
    if(project) {

      // Should be code over here to pull scenes from the projects

      // Scenes.get({sceneId: sceneId}).$promise.then(function())
      console.log("List of scenes over here is");
      console.log(project);
      self.scenes = project.scenes;
      console.log(self.scenes)
    }
  });

  staticSceneIds.map( function (s) {
    ProjectScenes.get({sceneId: s}).$promise.then(function (scenes) {
      if (scenes) {
        self.scenes = scenes;
        self.sortIntoArrays(self.scenes);
      }
    })
  });

  self.sortIntoArrays = function(s) {
    if (s.projectStage === 'todo') {
      todoArray.push(s);
      console.log(s.projectStage);
      console.log(todoArray);
    } else if (s.projectStage === 'transcribe') {
      transcribeArray.push(s);
      console.log(s.projectStage);
      console.log(transcribeArray);
    } else if (s.projectStage === 'translate') {
      translateArray.push(s);
      console.log(s.projectStage);
      console.log(translateArray);
    } else if (s.projectStage === 'done') {
      doneArray.push(s);
      console.log(s.projectStage);
      console.log(doneArray);
    }
  };
  })

  ProjectScenes.query({projectId: projectId}).$promise.then(function(scenes) {
    for (var i = scenes.length - 1; i >= 0; i--) {
      var scene = scenes[i];
      var scopevarName = 'scene' + scene.id + scene.progress;
      $scope[scopevarName].push(scene);
    }
  })

  var progresses = ['todo', 'transcribe', 'translate', 'subtitle', 'done'];

  for (var i = progresses.length - 1; i >= 0; i--) {
    for(var j = 1; j <= 4; j++) {
      (function() {
      var prog = progresses[i];
      var watchName = 'scene' + j + prog;
      $scope.$watch(watchName, function(newValue, oldValue) {
        if(newValue.length && !oldValue.length) {
          var sceneToUpdate = newValue[0];
          sceneToUpdate.progress = prog;
          SceneStageUpdate.update({sceneId: sceneToUpdate.id}, sceneToUpdate);
        }
      }, true);
    })();
    }
  }

  $scope.goToScene = function(scene) {
    if(scene.progress === 'transcribe' || scene.progress === 'translate' ||
      scene.progress === 'subtitle') {
      $location.path('/' + scene.progress + '/' + scene.id);
    }
  }


  // $scope.list1 = {title: 'AngularJS - Drag Me'};
  // $scope.list2 = {};
  // var self = this;

  // var Translation = $resource('/scenes/:sceneId/translations');
  // var Scene = $resource('/scenes/:sceneId');
  // var Subtitle = $resource('http://localhost:3000/scenes/:sceneId/subtitles');
  // var SubtitleUpdate = $resource('http://localhost:3000/subtitles/:subtitleId',
  //   null,
  //   {
  //     update: {method: 'PUT'}
  //   });

  // self.subtitles = null;
  // self.videoCurrentTime = 0
  // self.videoUrl = ''

  // // Get the current scene ID from the URL
  // var sceneId = $location.search().scene || 1;

  // // Get the current scene in order to grab the video URL
  // Scene.get({sceneId: sceneId}).$promise.then(function(scene) {
  //   if(scene) {
  //     self.videoUrl = scene.videoUrl
  //     console.log(self.videoUrl)
  //   }
  // })

  // // See if any subtitle entities already exist
  // Subtitle.query({sceneId: sceneId}).$promise.then(function(subtitles) {
  //   if(subtitles.length) {
  //     self.subtitles = subtitles[0];
  //   } else {
  //     // If no subtitles exist yet, use the translation to create them
  //     Translation.query({sceneId: sceneId}).$promise.then(function(translations) {
  //       // Split the lines of the translation to make the subtitles
  //       var s = new Subtitle({sceneId: sceneId});

  //       var translation = translations[0];
  //       var lines = translation.text.split('\n');
  //       var subs = []
  //       for (var i = 0; i < lines.length; i++) {
  //         subs.push({
  //           text: lines[i],
  //           start: null,
  //           end: null
  //         });
  //       }
  //       s.subs = subs;
  //       self.subtitles = s;
  //       s.$save({sceneId: sceneId});
  //     });
  //   }
  // });

  // /**
  //  * Gets the current subtitle text that should be displayed
  //  * over the video based on the current timestamp.
  //  */
  // self.getCurrentSubtitle = function() {
  //   if(!self.subtitles) {
  //     return '';
  //   }
  //   for (var i = self.subtitles.subs.length - 1; i >= 0; i--) {
  //     var curr = self.subtitles.subs[i];
  //     if(curr.start !== null && curr.end !== null &&
  //       self.videoCurrentTime >= curr.start && self.videoCurrentTime <= curr.end) {
  //       return curr.text;
  //     }
  //   }
  //   return '';
  // };

  // /**
  //  * Sets the start or end timestamp of a subtitle to the current
  //  * video time.
  //  */
  // self.setTimeStamp = function(sub, property) {
  //   sub[property] = self.videoCurrentTime;
  // }

  // /**
  //  * Saves the translation
  //  */
  // self.saveAndClose = function() {
  //   SubtitleUpdate.update({subtitleId: self.subtitles.id}, self.subtitles);
  //   // TODO return to the project page
  // };
}]);
