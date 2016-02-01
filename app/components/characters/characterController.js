angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', 'filmFactory', 'speciesFactory', 'vehiclesFactory', 'starshipsFactory', 'planetsFactory', '$routeParams', function($scope, $http, characterFactory, filmFactory, speciesFactory, vehiclesFactory, starshipsFactory, planetsFactory, $routeParams){
        
        var id = $routeParams.id;

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;

            filmFactory.getByUrls(person.film_urls, function(err, films){
                if(err){
                    console.log(err);
                }
                $scope.person.films = films;
            });

            planetsFactory.getByUrls(person.homeworld_url, function(err, homeworld){
                if(err){
                    console.log(err);
                }
                $scope.person.homeworld = homeworld[0];
            });

            speciesFactory.getByUrls(person.species_urls, function(err, species){
                if(err){
                    console.log(err);
                }
                $scope.person.species = species[0];
            });

            vehiclesFactory.getByUrls(person.vehicle_urls, function(err, vehicles){
                if(err){
                    console.log(err);
                    return;
                }
                $scope.person.vehicles = vehicles;
            });

            starshipsFactory.getByUrls(person.starship_urls, function(err, starships){
                if(err){
                    console.log(err);
                }
                $scope.person.starships = starships;
            });
            
            console.log($scope.person.vehicles);
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/characters', name: 'Characters' }
            ];
            $scope.pageTitle = $scope.person.name;
        });    
	}]);