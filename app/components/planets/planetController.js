angular.module('StarWarsApp')
	.controller('planetController', ['$scope', '$http', 'planetsFactory', 'filmFactory', 'characterFactory', '$routeParams', function($scope, $http, planetsFactory, filmFactory, characterFactory, $routeParams){
        var id = $routeParams.id;

		planetsFactory.getById(id, function(err, planet) {
            if(err) {
                return console.log(err);
            }
            $scope.planet = planet;
            
            characterFactory.getByUrls(planet.character_urls, function(err, characters){
                if(err){
                    console.log(err);
                }
                $scope.planet.characters = characters;
            });

            filmFactory.getByUrls(planet.film_urls, function(err, films){
                if(err){
                    console.log(err);
                }
                $scope.planet.films = films;
            });

            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/planets', name: 'Planets' }
            ];
            $scope.pageTitle = $scope.planet.name;
        });    
	}]);