angular.module('StarWarsApp')
	.controller('vehicleController', ['$scope', '$http', 'vehiclesFactory', '$routeParams', function($scope, $http, vehiclesFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/vehicles?page=1', name: 'Vehicles' }
        ];

		vehiclesFactory.getById(id, function(err, vehicle) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicle = vehicle;

            $scope.pageTitle = $scope.vehicle.name;
        });    
	}]);