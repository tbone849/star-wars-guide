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
angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', '$routeParams', function($scope, $http, characterFactory, $routeParams){

        var id = $routeParams.id;

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;
        });    
	}]);
angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var pageNumber = 1;
		var people = [];
		var personDetails = function(value){
			return {
				name: titleCase(value.name),
				name_underscore: titleCase(value.name).split(' ').join('_'),
				birth_year: getYear(value.birth_year),
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: getHeight(value.height),
				mass: getMass(value.mass),
				id: getId(value.url)
			};
		};

		var getMass = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'kg';
		};

		var getHeight = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'cm';
		};

		var getYear = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value;
		};

		var getId = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};

		return {
			getAll: function(callback)	{
				$http.get('http://swapi.co/api/people/?page=' + pageNumber)
					.then(function(response) {
						var peopleResponse = response.data.results;
						var newPeople = [];

						newPeople = peopleResponse.map(function(value){
							return personDetails(value);
						});

						people.push.apply(people, newPeople);

						pageNumber++;
						callback(null, people);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('http://swapi.co/api/people/' + id +'/')
					.then(function(response){
						var person = personDetails(response.data);

						callback(null, person);
					}, function(err){
						callback(err);
				});
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', function($scope, $http, characterFactory){

		characterFactory.getAll(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
        });

        $scope.getMoreCharacters = function(){
            characterFactory.getAll(function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.people = people;
            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('titleCase', function(){
		return function (string){
			var titledString = string.replace(/\b(\w)/g, function(letter){
				return letter.toUpperCase();
			});
			return titledString;
		};
	});