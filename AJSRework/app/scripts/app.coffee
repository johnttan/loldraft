'use strict'

angular.module('ajsloldraftApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'LocalStorageModule'
])
  .config ($routeProvider, $locationProvider, $httpProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'players'
        controller: 'PlayersCtrl'
      .otherwise
        redirectTo: '/'

    $locationProvider.html5Mode true
#
#    $httpProvider.interceptors.push ['$q', '$location', ($q, $location) ->
#      responseError: (response) ->
#        if response.status is 401 or response.status is 403
#          $location.path '/login'
#          $q.reject response
#        else
#          $q.reject response
#    ]
#  .run ($rootScope, $location, Auth) ->
#
#    # Redirect to login if route requires auth and you're not logged in
#    $rootScope.$on '$routeChangeStart', (event, next) ->
#      $location.path '/login'  if next.authenticate and not Auth.isLoggedIn()