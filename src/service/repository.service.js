(function () {
  'use strict';

  angular.module('gitron').factory('repositoryService', repositoryService);

  function repositoryService (localStorageService) {
    var REPOSITORY_LIST_KEY = 'REPOSITORY_LIST_KEY';
    var REPOSITORY_SELECTED_KEY = 'REPOSITORY_SELECTED_KEY';

    var repositorySelectedChangedCallbackList = [];

    return {
      initialize: initialize,
      getList: getList,
      add: add,
      setSelected: setSelected,
      getSelected: getSelected,
      addRepositorySelectedChangedCallback: addRepositorySelectedChangedCallback
    };

    function initialize() {
      var keys = localStorageService.keys();
      if (keys.indexOf(REPOSITORY_LIST_KEY) === -1) {
        localStorageService.set(REPOSITORY_LIST_KEY, []);
      }
      if (keys.indexOf(REPOSITORY_SELECTED_KEY) === -1) {
        localStorageService.set(REPOSITORY_SELECTED_KEY, null);
      }
    };

    function addRepositorySelectedChangedCallback(callback) {
      repositorySelectedChangedCallbackList.push(callback);
      return function() {
        var index = repositorySelectedChangedCallbackList.indexOf(callback);
        repositorySelectedChangedCallbackList.splice(index, 1);
      }
    };

    function getList() {
      return localStorageService.get(REPOSITORY_LIST_KEY);
    };

    function add(name, location) {
      var repoList = localStorageService.get(REPOSITORY_LIST_KEY);
      repoList.push({
        name: name,
        location: location
      });
      localStorageService.set(REPOSITORY_LIST_KEY, repoList);
    }

    function setSelected(repository) {
      localStorageService.set(REPOSITORY_SELECTED_KEY, repository);
      angular.forEach(repositorySelectedChangedCallbackList, function(callback) {
        callback(repository);
      });
    }

    function getSelected() {
      return localStorageService.get(REPOSITORY_SELECTED_KEY);
    }
  }
})();
