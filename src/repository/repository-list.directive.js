(function() {
    'use strict';

    angular
        .module('gitron')
        .directive('appRepositoryList', appRepositoryList);

    function appRepositoryList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'src/repository/repository-list.html',
            scope: {
            },
            link: linkFunc,
            controller: RepositoryListController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    RepositoryListController.$inject = ['repositoryService', 'ngDialog'];

    function RepositoryListController(repositoryService, ngDialog) {
        var vm = this;

        vm.repositoryList = [];
        vm.selectedRepository = null;
        vm.addRepository = addRepository;
        vm.loadRepositoryList = loadRepositoryList;
        vm.updateSelectedRepository = updateSelectedRepository;

        activate();

        function activate() {
          loadRepositoryList();
        }

        function addRepository() {
          ngDialog.open({
            template: 'src/repository/repository-new.html',
            controllerAs: 'vm',
            controller: function($scope) {
              var dialog = this;

              dialog.addAndClose = addAndClose;
              dialog.repository = {
                name: null,
                location: null
              };

              activate();

              function activate() {

              }

              function addAndClose() {
                repositoryService.add(dialog.repository.name, dialog.repository.location);
                $scope.closeThisDialog();
              }
            }
          })
          .closePromise.then(function () {
            vm.loadRepositoryList();
          });
        }

        function updateSelectedRepository() {
          repositoryService.setSelected(vm.selectedRepository);
        }

        function loadRepositoryList() {
          vm.repositoryList = repositoryService.getList();
          if (vm.repositoryList.length > 0 && vm.selectedRepository === null) {
            vm.selectedRepository = vm.repositoryList[0];
            vm.updateSelectedRepository();
          }
        }
    }
})();
