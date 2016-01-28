angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', '$routeParams', function($scope, $http, speciesFactory, $routeParams){
        var id = $routeParams.id;

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/species', name: 'Species' },
            ];
            $scope.pageTitle = $scope.specie.name;
        });    
	}]);