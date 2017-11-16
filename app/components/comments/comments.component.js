'use strict';

angular.module('translateam.comments', [])

.directive('comments', function($resource) {
  return {
  templateUrl: 'components/comments/comments.template.html',
  scope: {
    sceneId: '='
  },
  controller: function($scope, $element) {
    var Comments = $resource('/scenes/:sceneId/comments');
    var CommentAdd = $resource('http://localhost:3000/comments');
    $scope.commentAreaText = '';

    $scope.comments = [];
    Comments.query({sceneId: $scope.sceneId}).$promise.then(function(comments) {
      $scope.comments = comments;
    });

    $scope.addComment = function(commentValue){
      if (commentValue.length) {
        var newComment = new CommentAdd();
        newComment.sceneId = $scope.sceneId;
        newComment.username = "Test User";
        newComment.commentText = commentValue;
        newComment.$save();
        $scope.comments.push(newComment);
        $scope.commentTextArea = '';
      }
    };
  }
}});
