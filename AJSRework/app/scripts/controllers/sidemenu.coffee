angular.module('ajsloldraftApp')
.controller 'SideMenuCtrl', ['$scope', 'Players', '$location', ($scope, Players, $location) ->
    if Players.playersobject is undefined
      Players.getplayers()
    $scope.isActive = (route) ->
      console.log $location.path()
      route is $location.path()
    ]