angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', '$routeParams', function($scope, $http, characterFactory, $routeParams){
        var id = $routeParams.id;

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;
            $scope.crumbsArray = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/characters', name: 'Characters' },
            	{ name: $scope.person.name }
            ];
        });    
	}]);