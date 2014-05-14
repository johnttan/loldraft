'use strict'

angular.module('ajsloldraftApp')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
