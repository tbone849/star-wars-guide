angular.module('StarWarsApp')
	.controller('filmController', ['$scope', '$http', 'filmFactory', '$routeParams', function($scope, $http, filmFactory, $routeParams){

        var id = $routeParams.id;

        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/films?page=1', name: 'Films' }
        ];

		filmFactory.getById(id, function(err, film) {
            if(err) {
                return console.log(err);
            }
            $scope.film = film;
            //console.log($scope.film);

            $scope.pageTitle = $scope.film.name;
        });  
	}]);