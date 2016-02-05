angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', 'planetsFactory', 'speciesFactory', '$routeParams', function($scope, $http, characterFactory, planetsFactory, speciesFactory, $routeParams){
        
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/characters/page=1', name: 'Characters' }
        ];

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;

            planetsFactory.getByUrls(person.homeworld_url, function(err, homeworld){
                if(err) {
                    console.log(err);
                }
                $scope.person.homeworld = homeworld[0];
            });

            speciesFactory.getByUrls(person.speciesUrls, function(err, species){
                if(err) {
                    console.log(err);
                }
                $scope.person.species = species[0];
            });
            
            
            $scope.pageTitle = $scope.person.name;
        });    
	}]);