angular.module('StarWarsApp')
	.controller('filmController', ['$scope', '$http', 'filmFactory', 'characterFactory', 'speciesFactory', 'vehiclesFactory', 'starshipsFactory', 'planetsFactory', '$routeParams', function($scope, $http, filmFactory, characterFactory, speciesFactory, vehiclesFactory, starshipsFactory, planetsFactory, $routeParams){

        var id = $routeParams.id;

		filmFactory.getById(id, function(err, film) {
            if(err) {
                return console.log(err);
            }
            $scope.film = film;

            characterFactory.getByUrls(film.character_urls, function(err, characters){
                if(err){
                    console.log(err);
                }
                $scope.film.characters = characters;
            });

            planetsFactory.getByUrls(film.planet_urls, function(err, planets){
                if(err){
                    console.log(err);
                }
                $scope.film.planets = planets;
            });

            speciesFactory.getByUrls(film.species_urls, function(err, species){
                if(err){
                    console.log(err);
                }
                $scope.film.species = species;
            });

            starshipsFactory.getByUrls(film.starship_urls, function(err, starships){
                if(err){
                    console.log(err);
                }
                $scope.film.starships = starships;
            });

            vehiclesFactory.getByUrls(film.vehicle_urls, function(err, vehicles){
                if(err){
                    console.log(err);
                }
                $scope.film.vehicles = vehicles;
            });

            console.log($scope.film);

            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/films', name: 'Films' }
            ];
            $scope.pageTitle = $scope.film.name;
        });  
	}]);