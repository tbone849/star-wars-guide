angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', 'planetsFactory', 'speciesFactory', 'wikiaFactory', '$routeParams', function($scope, $http, characterFactory, planetsFactory, speciesFactory, wikiaFactory, $routeParams){
        
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/characters?page=1', name: 'Characters' }
        ];

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;
            //console.log($scope.person);

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

            // waiting on api key
            //wikiaFactory.getAbstract(person.name, function(err, response){
                //console.log(err);
                //console.log(response);
            //});
            
            
            $scope.pageTitle = $scope.person.name;
        });    
	}]);