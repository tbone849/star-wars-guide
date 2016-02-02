angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', 'characterFactory', 'filmFactory', '$routeParams', function($scope, $http, speciesFactory, characterFactory, filmFactory, $routeParams){
        var id = $routeParams.id;

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;

            characterFactory.getByUrls(specie.character_urls, function(err, characters){
                if(err){
                    console.log(err);
                }
                $scope.specie.characters = characters;
            });

            filmFactory.getByUrls(specie.film_urls, function(err, films){
                if(err){
                    console.log(err);
                }
                $scope.specie.films = films;
            });

            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/species', name: 'Species' },
            ];
            $scope.pageTitle = $scope.specie.name;
        });    
	}]);