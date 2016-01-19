angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', function($scope, $http, characterFactory){

		characterFactory.getAll(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            console.log(people);
        });

        $scope.getMoreCharacters = function(){
        	characterFactory.getAll(function(err, people) {
        		if(err) {
        			return console.log(err);
        		}
        		$scope.people = people;
        		console.log(people);
        	});
        };
         
	}]);