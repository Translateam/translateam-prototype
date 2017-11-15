/**
 * Created by dishasoni on 11/14/17.
 */


'use strict';

angular.module('translateam.translate', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/translate', {
      templateUrl: 'translate/translate.html',
      controller: 'translateCtrl',
      controllerAs: 'TransCtrl'
    });
  }])

  .controller('translateCtrl', ['$resource', '$location', function($resource, $location) {
    var self = this;
    var Scene = $resource('/scenes/:sceneId');
    var Transcription = $resource('/scenes/:sceneId/transcripts');
    var Translation = $resource('/scenes/:sceneId/translations');
    var TranslationUpdate = $resource('http://localhost:3000/translations/:resId',
      null,
      {
        update: {method: 'PUT'},
        save: {method: 'POST'}
      });
   // self.translations = null;
    // Get the current scene ID from the URL
    var sceneId = $location.search().scene || 4;

    // Get the current scene in order to grab the video URL
    Scene.get({sceneId: sceneId}).$promise.then(function(scene) {
      if(scene) {
        self.scene = scene;
        self.videoUrl = scene.videoUrl
        console.log(self.videoUrl)
      }
    })
    Transcription.query({sceneId: sceneId}).$promise.then(function(transcriptions) {
    self.transcripts =transcriptions;
      console.log( self.transcripts);


  })
    Translation.query({sceneId: sceneId}).$promise.then(function(translations) {
       self.translations = translations;
        console.log(self.translations);
    })

    self.saveAndClose = function(translationValue) {
      console.log("in function")
      console.log(self.translations);
      if(self.translations.length > 0){
        self.translations =self.translations[0];
        var translationId  = self.translations.id;
        self.translations.text  = translationValue;
        TranslationUpdate.update({resId : translationId}, self.translations);
        $location.url("/view1");
      }else{
        self.translations = {};
        self.translations.sceneId = sceneId;
        var currentdate = new Date();
        var translationId  = currentdate.getTime();
        self.translations.text  = translationValue;
        TranslationUpdate.save(self.translations);
        $location.url("/view1");
      }
    };
  }]);
