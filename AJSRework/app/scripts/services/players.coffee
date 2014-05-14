angular.module("ajsloldraftApp")
.service "Players", ['$resource', '$q', 'localStorageService',
    class PlayersResource
      constructor: (@$resource, @$q, @localStorageService)->
      resourceservice: ->
        @$resource "/api/players",
          query:
            method: "GET"
      getplayers: ->
        @playersobject = @localStorageService.get('Players')
        console.log @playersobject
        if @playersobject is null
          @playersobject = @resourceservice().query()
          @playersobject.$promise.then(
            do(local=@localStorageService)->
              (value)->
                @playersobject = value
                console.log @playersobject
                local.add('Players', @playersobject)
          )

  ]