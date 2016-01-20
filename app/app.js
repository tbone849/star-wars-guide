angular.module('StarWarsApp', ['lumx', 'ngRoute'])
	.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : 'components/categories.html'
        }).when('/characters', {
			templateUrl : 'components/characters/characters.html',
			controller : 'charactersController'
        }).when('/characters/:id', {
        	templateUrl : 'components/characters/character.html',
        	controller : 'characterController'
        }).otherwise('/');
    }]);