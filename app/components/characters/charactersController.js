angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', function($scope, $http, characterFactory){

		characterFactory.getAll(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
        });

        $scope.getMoreCharacters = function(){
            characterFactory.getAll(function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.people = people;
            });
        };
         
	}]);