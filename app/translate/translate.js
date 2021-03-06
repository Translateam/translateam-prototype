/**
 * Created by dishasoni on 11/14/17.
 */


'use strict';

angular.module('translateam.translate', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/translate/:sceneId', {
      templateUrl: 'translate/translate.html',
      controller: 'translateCtrl',
      controllerAs: 'TransCtrl'
    });
  }])

  .controller('translateCtrl', ['$resource', '$location', '$routeParams', 'translateService', function($resource, $location, $routeParams, translateService) {
    var self = this;
    var Scene = $resource('/scenes/:sceneId');
    var Transcription = $resource('/scenes/:sceneId/transcripts');
    var Translation = $resource('/scenes/:sceneId/translations');
    var Comments = $resource('http://localhost:3000/scenes/:sceneId/comments');
    var TranslationUpdate = $resource('http://localhost:3000/translations/:resId',
      null,
      {
        update: {method: 'PUT'},
        save: {method: 'POST'}
      });
     var CommentUpdate = $resource('http://localhost:3000/comments/:commentId',
      null,
      {
        update: {method: 'PUT'},
        save: {method: 'POST'}
      });
   // self.translations = null;
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
    Translation.query({sceneId: sceneId}).$promise.then(function(translations) {
       self.translations = translations;
      self.trans = self.translations[0].text;
      console.log("translations");
      console.log(self.translations);
    })

    self.autoTranslate = function() {
      var selection = window.getSelection().toString();
      if(!selection.length) {
        alert('You must select some text in the transcription to auto-translate.');
      } else if(self.translations.length) {
        translateService(selection).then(function(translation) {
          self.trans += translation;
        });
      }
    }

    Comments.query({sceneId: sceneId}).$promise.then(function(comments) {
      self.comments = comments;
      console.log("comments");
      console.log(self.comments);
    })

    self.addComments = function(newComment) {
     if(newComment != ""){
       if(self.comments.length > 0){
         var commentObj = {"text":newComment};
         self.comments[0].comments.push(commentObj);
         var comId =  self.comments[0].id;
         CommentUpdate.update({commentId : comId}, self.comments[0]);
       }else{
         self.comments = {};
         self.comments.sceneId = sceneId;
         var currentdate = new Date();
         var comId  = currentdate.getTime();
         var commentObj = {"text":newComment};
         self.comments.comments = [commentObj];
         CommentUpdate.save(self.comments);

       }
       self.com = null;



     }
    };


    self.saveAndClose = function(translationValue) {
      if(self.translations.length > 0){
      //  self.translations =self.translations[0];
        var translationId  = self.translations[0].id;
        self.trans = self.translations[0].text  = translationValue;
        TranslationUpdate.update({resId : translationId}, self.translations[0]);
        $location.url("/project");
      }else{
        self.translations = {};
        self.translations.sceneId = sceneId;
        var currentdate = new Date();
        var translationId  = currentdate.getTime();
        self.translations.text  = translationValue;
        TranslationUpdate.save(self.translations);
        $location.url("/project");
      }
    };
  }]);
