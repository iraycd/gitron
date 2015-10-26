(function() {
    'use strict';

    var NodeGit = require("nodegit");

    angular
        .module('gitron')
        .directive('appLog', appLog);

    function appLog() {
        var directive = {
            restrict: 'E',
            templateUrl: 'src/log/log.html',
            scope: {
            },
            link: linkFunc,
            controller: AppLogController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    AppLogController.$inject = ['$scope', 'repositoryService', '$filter'];

    function AppLogController($scope, repositoryService, $filter) {
        var vm = this;

        vm.repositoryLogList = [];

        activate();

        function activate() {
          repositoryService.addRepositorySelectedChangedCallback(function(repository) {
            vm.repositoryLogList = [];
            updateLogList(repository.location);
          });

          var selectedRepo = repositoryService.getSelected();
          if (selectedRepo !== null) {
            vm.repositoryLogList = [];
            updateLogList(selectedRepo.location);
          }
        }

        function updateLogList(path) {
          NodeGit.Repository.open(path)
            .then(function(repo) {
              return repo.getMasterCommit();
            })
            .then(function(firstCommitOnMaster) {
              // History returns an event.
              var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.Time);

              // History emits "commit" event for each commit in the branch's history
              history.on("commit", function(commit) {
                vm.repositoryLogList.push({
                  sha: commit.sha(),
                  author: {
                    name: commit.author().name(),
                    email: commit.author().email()
                  },
                  date: $filter('date')(commit.date(), 'short'),
                  message: commit.message()
                });

                // console.log("commit " + commit.sha());
                // console.log("Author:", commit.author().name() +
                //   " <" + commit.author().email() + ">");
                // console.log("Date:", commit.date());
                // console.log("\n    " + commit.message());
              });
              history.on("end", function () {
                $scope.$apply();
              });

              // Don't forget to call `start()`!
              history.start();
            })
            .done();
        }
    }
})();
