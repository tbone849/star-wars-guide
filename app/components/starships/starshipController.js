angular.module('StarWarsApp')
	.controller('starshipController', ['$scope', '$http', 'starshipsFactory', '$routeParams', function($scope, $http, starshipsFactory, $routeParams){
        var id = $routeParams.id;

		starshipsFactory.getById(id, function(err, starship) {
            if(err) {
                return console.log(err);
            }
            $scope.starship = starship;
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/starships', name: 'Starships' }
            ];
            $scope.pageTitle = $scope.starship.name;
        });    
	}]);