'use strict';

angular.module('translateam.translateService', [])

.factory('translateService', ['$http', function($http) {
  return function(text) {
    var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20171115T013944Z.3e85c4f2b8c638bc.1e34102e5de4aa3134d594c4f47591c95fef4bf1&text=' + text + '&lang=en';
    return $http.get(url).then(function(respData) {
      return respData.data.text[0];
    })
  };
}]);
