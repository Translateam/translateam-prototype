'use strict';

angular.module('translateam.version', [
  'translateam.version.interpolate-filter',
  'translateam.version.version-directive'
])

.value('version', '0.1');
