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
    var Comments = $resource('/scenes/:sceneId/comments');
    self.commentAreaText = '';

    var TranscriptionUpdate = $resource('http://localhost:3000/transcripts/:resId',
      null,
      {
        update: {method: 'PUT'},
        save: {method: 'POST'}
      });

    var CommentAdd = $resource('http://localhost:3000/comments');

    // Get the current scene ID from the URL
    var sceneId = $routeParams.sceneId;

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
    self.comments = [];
    Comments.query({sceneId: sceneId}).$promise.then(function(comments) {
      self.comments = comments;
    })

    self.saveAndClose = function(transcriptionValue) {
      if(self.transcripts.length > 0){
        self.transcripts =self.transcripts[0];
        var transcriptionId  = self.transcripts.id;
        self.transcripts.text  = transcriptionValue;
        TranscriptionUpdate.update({resId : transcriptionId}, self.transcripts);
        $location.url("/view1");
      }else{
        self.transcripts = {};
        self.transcripts.sceneId = sceneId;
        var currentdate = new Date();
        var transcriptionId  = currentdate.getTime();
        self.transcripts.text  = transcriptionValue;
        TranscriptionUpdate.save(self.transcripts);
        $location.url("/view1");
      }
    };

    self.addComment = function(commentValue){
      if (commentValue.length) {
        var newComment = new CommentAdd();
        newComment.sceneId = sceneId;
        newComment.username = "Test User";
        newComment.commentText = commentValue;
        newComment.$save();
        self.comments.push(newComment);
        self.commentTextArea = '';
      }
    };



  }]);
