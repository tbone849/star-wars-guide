angular.module('StarWarsApp')
	.controller('starshipController', ['$scope', '$http', 'starshipsFactory', '$routeParams', function($scope, $http, starshipsFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/starships?page=1', name: 'Starships' }
        ];

		starshipsFactory.getById(id, function(err, starship) {
            if(err) {
                return console.log(err);
            }
            $scope.starship = starship;

            $scope.pageTitle = $scope.starship.name;
        });    
	}]);