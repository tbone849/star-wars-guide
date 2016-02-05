angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', '$routeParams', function($scope, $http, speciesFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/species?page=1', name: 'Species' },
        ];

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;

            $scope.pageTitle = $scope.specie.name;
        });    
	}]);