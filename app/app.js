angular.module('StarWarsApp', ['lumx', 'ngRoute', 'underscore', 'ngCookies'])
	.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : 'components/categories.html'
        }).when('/characters', {
			templateUrl : 'components/characters/characters.html',
			controller : 'charactersController'
        }).when('/characters/:id', {
            templateUrl : 'components/characters/character.html',
            controller : 'characterController'
        }).when('/films', {
            templateUrl: 'components/films/films.html',
            controller : 'filmsController'
        }).when('/films/:id', {
            templateUrl : 'components/films/film.html',
            controller : 'filmController'
        }).when('/species', {
            templateUrl : 'components/species/species.html',
            controller : 'speciesController'
        }).when('/species/:id', {
            templateUrl : 'components/species/specie.html',
            controller : 'specieController'
        }).when('/starships', {
            templateUrl : 'components/starships/starships.html',
            controller : 'starshipsController'
        }).otherwise('/');
    }]);