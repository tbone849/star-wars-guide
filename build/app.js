angular.module('StarWarsApp', ['lumx', 'ngRoute', 'underscore'])
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
		var numberOfPages;
		var people = [];
		var personDetails = function(value){
			return {
				name: titleCase(value.name),
				birth_year: formatYear(value.birth_year),
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: formatHeight(value.height),
				mass: formatMass(value.mass),
				id: getIdFromUrl(value.url)
			};
		};

		var formatMass = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'kg';
		};

		var formatHeight = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'cm';
		};

		var formatYear = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value;
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};

		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/people/?page=' + page)
					.then(function(response) {
						pageNumber = page;
						var peopleResponse = response.data.results;
						var newPeople = [];
						var totalPeople;

						newPeople = peopleResponse.map(function(value){
							return personDetails(value);
						});

						totalPeople = response.data.count;
						numberOfPages = Math.ceil(totalPeople / 10);

						people = newPeople;

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
			},

			getPageNumber: function(){
				return pageNumber;
			}, 

			getNumberOfPages: function(){
				return numberOfPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', function($scope, $http, characterFactory, _){

        var page = characterFactory.getPageNumber();

		characterFactory.getAll(page, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.people = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages);
            $scope.currentPage = characterFactory.getPageNumber();

        });

        $scope.getNewPage = function(newPageNumber){
            characterFactory.getAll(newPageNumber, function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.people = people;
                $scope.currentPage = characterFactory.getPageNumber();
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