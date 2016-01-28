angular.module('StarWarsApp')
	.controller('vehicleController', ['$scope', '$http', 'vehiclesFactory', '$routeParams', function($scope, $http, vehiclesFactory, $routeParams){
        var id = $routeParams.id;

		vehiclesFactory.getById(id, function(err, vehicle) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicle = vehicle;
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/vehicles', name: 'Vehicles' }
            ];
            $scope.pageTitle = $scope.vehicle.name;
        });    
	}]);