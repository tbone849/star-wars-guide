angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', '$routeParams', function($scope, $http, speciesFactory, $routeParams){
        var id = $routeParams.id;

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;
            $scope.crumbsArray = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/species', name: 'Species' },
            	{ name: $scope.specie.name }
            ];
        });    
	}]);