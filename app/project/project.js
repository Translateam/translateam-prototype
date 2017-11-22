'use strict';

angular.module('translateam.project', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/project', {
    templateUrl: 'project/project.html',
    controller: 'ProjectCtrl',
    controllerAs: 'ProjectCtrl'
  });
}])

.controller('ProjectCtrl', ['$resource', '$location', function($resource, $location, $scope) {
  var self = this;
  var todoArray = [];
  var transcribeArray = [];
  var translateArray = [];
  var doneArray = [];
  var Project = $resource('/projects/:projectId');
  var Scenes = $resource('/scenes/:sceneId');
  var ProjectScenes = $resource('/scenes/:sceneId');
  var SceneStageUpdate = $resource('http://localhost:3000/scenes/:sceneId',
    null,
    {
      update: {method: 'PUT'}
    });

  var projectId = $location.search().project || 1;
  var staticSceneIds = [1, 2, 3, 4];

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

}]);
