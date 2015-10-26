(function() {
  'use strict';

  angular
    .module('gitron', [
      'LocalStorageModule',
      'ui.router',
      'ngDialog'
    ])
    .run(runBlock);

  function runBlock(repositoryService) {
    repositoryService.initialize();
  };
})();
