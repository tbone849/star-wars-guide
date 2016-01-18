angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', function($scope, $http, characterFactory){

		characterFactory.getAllCharacters(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            console.log(people);
        });

        $scope.getMoreCharacters = function(){
        	characterFactory.getAllCharacters(function(err, people) {
        		if(err) {
        			return console.log(err);
        		}
        		$scope.people = people;
        		console.log(people);
        	});
        };
         
	}]);