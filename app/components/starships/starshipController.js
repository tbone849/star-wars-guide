angular.module('StarWarsApp')
	.controller('starshipController', ['$scope', '$http', 'starshipsFactory', 'characterFactory', 'filmFactory', '$routeParams', function($scope, $http, starshipsFactory, characterFactory, filmFactory, $routeParams){
        var id = $routeParams.id;

		starshipsFactory.getById(id, function(err, starship) {
            if(err) {
                return console.log(err);
            }
            $scope.starship = starship;

            characterFactory.getByUrls(starship.character_urls, function(err, characters){
                if(err){
                    console.log(err);
                }
                $scope.starship.characters = characters;
            });

            filmFactory.getByUrls(starship.film_urls, function(err, films){
                if(err){
                    console.log(err);
                }
                $scope.starship.films = films;
            });

            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/starships', name: 'Starships' }
            ];
            $scope.pageTitle = $scope.starship.name;
        });    
	}]);