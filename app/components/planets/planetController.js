angular.module('StarWarsApp')
	.controller('planetController', ['$scope', '$http', 'planetsFactory', '$routeParams', function($scope, $http, planetsFactory, $routeParams){
        var id = $routeParams.id;

		planetsFactory.getById(id, function(err, planet) {
            if(err) {
                return console.log(err);
            }
            $scope.planet = planet;
            console.log($scope.planet);
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/planets', name: 'Planets' }
            ];
            $scope.pageTitle = $scope.planet.name;
        });    
	}]);