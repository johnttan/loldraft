'use strict'
angular.module('ajsloldraftApp')
.controller 'PlayersCtrl', ['$scope', 'Players', '$location', ($scope, Players, $location) ->
    $scope.players = Players.playersobject
    $scope.sorting = "name"
    $scope.changeSort = (sort)->
      if $scope.sorting == sort
        $scope.sorting = "-" + $scope.sorting
      else
        $scope.sorting = sort

    ]