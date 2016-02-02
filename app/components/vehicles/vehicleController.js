angular.module('StarWarsApp')
	.controller('vehicleController', ['$scope', '$http', 'vehiclesFactory', 'characterFactory', 'filmFactory', '$routeParams', function($scope, $http, vehiclesFactory, characterFactory, filmFactory, $routeParams){
        var id = $routeParams.id;

		vehiclesFactory.getById(id, function(err, vehicle) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicle = vehicle;

            characterFactory.getByUrls(vehicle.character_urls, function(err, characters){
                if(err){
                    console.log(err);
                }
                $scope.vehicle.characters = characters;
            });

            filmFactory.getByUrls(vehicle.film_urls, function(err, films){
                if(err){
                    console.log(err);
                }
                $scope.vehicle.films = films;
            });

            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/vehicles', name: 'Vehicles' }
            ];
            $scope.pageTitle = $scope.vehicle.name;
        });    
	}]);