angular.module('StarWarsApp', ['lumx', 'ngRoute', 'underscore'])
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

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
        }).when('/starships/:id', {
            templateUrl : 'components/starships/starship.html',
            controller : 'starshipController'
        }).when('/vehicles', {
            templateUrl : 'components/vehicles/vehicles.html',
            controller : 'vehiclesController'
        }).when('/vehicles/:id', {
            templateUrl : 'components/vehicles/vehicle.html',
            controller : 'vehicleController'
        }).when('/planets', {
            templateUrl : 'components/planets/planets.html',
            controller : 'planetsController'
        }).when('/planets/:id', {
            templateUrl : 'components/planets/planet.html',
            controller : 'planetController'
        }).otherwise('/');
    }]);