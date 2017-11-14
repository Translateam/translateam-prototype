'use strict';

angular.module('translateam.help-dialog', [])

.directive('helpDialog', function() {
  return {
	templateUrl: 'components/help-dialog/help-dialog.template.html',
  transclude: true,
  scope: { title: '@' }
}})
