angular.module('StarWarsApp', ['lumx', 'ngRoute'])
	.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl : 'components/categories.html'
        }).when('/characters', {
			templateUrl : 'components/characters/characters.html',
			controller : 'characterController'
        }).otherwise('/');
    }]);
angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', function($scope, $http, characterFactory){

		characterFactory.getAll(function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            console.log(people);
        });

        $scope.getMoreCharacters = function(){
            characterFactory.getAll(function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.people = people;
                console.log(people);
            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var pageNumber = 1;
		var people = [];
		var personDetails = function(value){
			return {
				name: titleCase(value.name),
				birth_year: value.birth_year,
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: getHeight(value.height),
				mass: getMass(value.mass)
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

		return {
			getAll: function(callback)	{
				console.log('function called');
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

			getByUrl: function(url, callback){
				$http.get(url).then(function(response){
					var character = personDetails(response);
					callback(null, character);
				}, function(err){
					callback(err);
				});
			}
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