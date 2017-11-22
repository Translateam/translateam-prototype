'use strict';

angular.module('translateam.transcribe', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/transcribe/:sceneId', {
      templateUrl: 'transcribe/transcribe.html',
      controller: 'transcribeCtrl',
      controllerAs: 'ScribeCtrl'
    });
  }])

  .controller('transcribeCtrl', ['$resource', '$location', '$routeParams', function($resource, $location, $routeParams) {
    var self = this;
    var Scene = $resource('/scenes/:sceneId');
    var Transcription = $resource('/scenes/:sceneId/transcripts');

    var TranscriptionUpdate = $resource('http://localhost:3000/transcripts/:resId',
      null,
      {
        update: {method: 'PUT'},
        save: {method: 'POST'}
      });

    // Get the current scene ID from the URL
    var sceneId = $routeParams.sceneId;
    self.sceneId = sceneId;

    // Get the current scene in order to grab the video URL
    Scene.get({sceneId: sceneId}).$promise.then(function(scene) {
      if(scene) {
        self.scene = scene;
        self.videoUrl = scene.videoUrl
      }
    })
    Transcription.query({sceneId: sceneId}).$promise.then(function(transcriptions) {
      self.transcripts =transcriptions;
    })

    self.saveAndClose = function(transcriptionValue) {
      if(self.transcripts.length > 0){
        self.transcripts =self.transcripts[0];
        var transcriptionId  = self.transcripts.id;
        self.transcripts.text  = transcriptionValue;
        TranscriptionUpdate.update({resId : transcriptionId}, self.transcripts);
        $location.url("/project");
      }else{
        self.transcripts = {};
        self.transcripts.sceneId = sceneId;
        var currentdate = new Date();
        var transcriptionId  = currentdate.getTime();
        self.transcripts.text  = transcriptionValue;
        TranscriptionUpdate.save(self.transcripts);
        $location.url("/project");
      }
    };

  }]);
