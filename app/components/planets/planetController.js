angular.module('StarWarsApp')
	.controller('planetController', ['$scope', '$http', 'planetsFactory', '$routeParams', function($scope, $http, planetsFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/planets?page=1', name: 'Planets' }
        ];

		planetsFactory.getById(id, function(err, planet) {
            if(err) {
                return console.log(err);
            }
            $scope.planet = planet;

            $scope.pageTitle = $scope.planet.name;
        });    
	}]);