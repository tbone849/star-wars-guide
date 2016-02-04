angular.module('StarWarsApp', ['lumx', 'ngRoute', 'underscore', 'ngCookies'])
	.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : 'components/categories.html'
        }).when('/characters/page=:page', {
			templateUrl : 'components/characters/characters.html',
			controller : 'charactersController'
        }).when('/characters/id/:id', {
            templateUrl : 'components/characters/character.html',
            controller : 'characterController'
        }).when('/films/page=:page', {
            templateUrl: 'components/films/films.html',
            controller : 'filmsController'
        }).when('/films/id/:id', {
            templateUrl : 'components/films/film.html',
            controller : 'filmController'
        }).when('/species/page=:page', {
            templateUrl : 'components/species/species.html',
            controller : 'speciesController'
        }).when('/species/id/:id', {
            templateUrl : 'components/species/specie.html',
            controller : 'specieController'
        }).when('/starships/page=:page', {
            templateUrl : 'components/starships/starships.html',
            controller : 'starshipsController'
        }).when('/starships/id/:id', {
            templateUrl : 'components/starships/starship.html',
            controller : 'starshipController'
        }).when('/vehicles/page=:page', {
            templateUrl : 'components/vehicles/vehicles.html',
            controller : 'vehiclesController'
        }).when('/vehicles/id/:id', {
            templateUrl : 'components/vehicles/vehicle.html',
            controller : 'vehicleController'
        }).when('/planets/page=:page', {
            templateUrl : 'components/planets/planets.html',
            controller : 'planetsController'
        }).when('/planets/id/:id', {
            templateUrl : 'components/planets/planet.html',
            controller : 'planetController'
        }).otherwise('/');
    }]);