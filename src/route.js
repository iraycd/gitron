(function() {
  'use strict';

  angular
    .module('gitron')
    .config(appConfig);

  function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/log");

    $stateProvider
      .state('log', {
        url: '/log',
        template: '<app-log></app-log>'
      });
  }

}());
