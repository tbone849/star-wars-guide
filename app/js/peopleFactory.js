angular.module('StarWarsApp')
	.factory('PeopleFactory', ['$http', function($http){
		return function(country){
            return $http.get('http://swapi.co/api/people/');
        };
	}]);