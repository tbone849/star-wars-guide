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
            $scope.crumbsArray = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/characters', name: 'Characters' },
            	{ name: $scope.person.name }
            ];
        });    
	}]);
angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var people = [];
		var totalCharacterPages;
		var formatPersonDetails = function(value){
			return {
				name: titleCase(value.name),
				birth_year: formatYear(value.birth_year),
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: formatHeight(value.height),
				mass: formatMass(value.mass),
				id: parseInt(getIdFromUrl(value.url)),
				img_url: "./assets/img/characters/" + titleCase(value.name) + ".jpg",
				url: '#/characters/' + getIdFromUrl(value.url)
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
						var peopleResponse = response.data.results;
						var newPeople = [];
						var totalPeople;

						newPeople = peopleResponse.map(function(value){
							return formatPersonDetails(value);
						});

						totalPeople = response.data.count;
						totalCharacterPages = Math.ceil(totalPeople / 10);

						people = newPeople;

						callback(null, people);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('http://swapi.co/api/people/' + id +'/')
					.then(function(response){
						var person = formatPersonDetails(response.data);

						callback(null, person);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalCharacterPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', '$cookies', function($scope, $http, characterFactory, _, $cookies){

        $scope.crumbsArray = [
            { url: '#/', name: 'Home' },
            { name: 'Characters' }
        ];
        var pageCache = $cookies.get('currentCharacterPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		characterFactory.getAll($scope.currentPage, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.characters = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentCharacterPage', newPageNumber);
            characterFactory.getAll(newPageNumber, function(err, people) {
                if(err) {
                    return console.log(err);
                }
                $scope.characters = people;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.controller('filmController', ['$scope', '$http', 'filmFactory', '$routeParams', function($scope, $http, filmFactory, $routeParams){

        var id = $routeParams.id;

		filmFactory.getById(id, function(err, film) {
            if(err) {
                return console.log(err);
            }
            $scope.film = film;
            $scope.crumbsArray = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/films', name: 'Films' },
            	{ name: $scope.film.name }
            ];
        });  
	}]);
angular.module('StarWarsApp')
	.factory('filmFactory', ['$http', 'titleCase', function($http, titleCase){

		var films = [];
		var totalFilmPages;
		var formatFilmDetails = function(value){
			return {
				name: 'Episode ' + getRomanNumeral(value.episode_id) + ': ' + value.title,
				director: value.director,
				id: parseInt(value.episode_id),
				crawl: value.opening_crawl,
				producer: value.producer,
				date: formatDate(value.release_date),
				img_url: "./assets/img/films/" + value.title + ".jpg",
				url: "#/films/" + getIdFromUrl(value.url)
			};
		};

		var formatDate = function(date){
			var dateParts = date.split('-');
			var newDate = dateParts[1] + '-' + dateParts[2] + '-' + dateParts[0];
			return newDate;
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};

		var getRomanNumeral = function(number){
			var numeral;
			switch(number){
				case 1: 
				numeral = 'I';
				break;
				case 2: 
				numeral = 'II';
				break;
				case 3: 
				numeral = 'III';
				break;
				case 4: 
				numeral = 'IV';
				break;
				case 5: 
				numeral = 'V';
				break;
				case 6: 
				numeral = 'VI';
				break;
				case 7: 
				numeral = 'VII';
				break;
				case 8: 
				numeral = 'VIII';
				break;
				case 9: 
				numeral = 'IX';
				break;
				case 10: 
				numeral = 'X';
				break;
			}
			return numeral;
		};

		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/films/?page=' + page)
					.then(function(response) {
						//console.log(response);
						var filmResponse = response.data.results;
						var newFilms = [];
						var totalFilms;

						newFilms = filmResponse.map(function(value){
							return formatFilmDetails(value);
						});

						totalFilms = response.data.count;
						totalFilmPages = Math.ceil(totalFilms / 10);

						films = newFilms;

						callback(null, films);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('http://swapi.co/api/films/' + id +'/')
					.then(function(response){
						var film = formatFilmDetails(response.data);

						callback(null, film);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalFilmPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('filmsController', ['$scope', '$http', 'filmFactory', '_', '$cookies', function($scope, $http, filmFactory, _, $cookies){
        
        $scope.crumbsArray = [
            { url: '#/', name: 'Home' },
            { name: 'Films' }
        ];
        var pageCache = $cookies.get('currentFilmPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		filmFactory.getAll($scope.currentPage, function(err, films) {
            if(err) {
                return console.log(err);
            }
            $scope.films = films;
            console.log($scope.films);
            var numberOfPages = filmFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentFilmPage', newPageNumber);
            filmFactory.getAll(newPageNumber, function(err, films) {
                if(err) {
                    return console.log(err);
                }
                $scope.films = films;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', '$routeParams', function($scope, $http, speciesFactory, $routeParams){
        var id = $routeParams.id;

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;
            $scope.crumbsArray = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/species', name: 'Species' },
            	{ name: $scope.specie.name }
            ];
        });    
	}]);
angular.module('StarWarsApp')
	.controller('speciesController', ['$scope', '$http', 'speciesFactory', '_', '$cookies', function($scope, $http, speciesFactory, _, $cookies){

        $scope.crumbsArray = [
            { url: '#/', name: 'Home' },
            { name: 'Species' }
        ];
        var pageCache = $cookies.get('currentSpeciesPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		speciesFactory.getAll($scope.currentPage, function(err, species) {
            if(err) {
                return console.log(err);
            }
            $scope.species = species;
            var numberOfPages = speciesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentSpeciesPage', newPageNumber);
            speciesFactory.getAll(newPageNumber, function(err, species) {
                if(err) {
                    return console.log(err);
                }
                $scope.species = species;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('speciesFactory', ['$http', 'titleCase', function($http, titleCase){

		var species = [];
		var totalSpeciesPages;
		var formatSpeciesDetails = function(value){
			return {
				name: titleCase(value.name),
				classification: titleCase(value.classification),
				designation: titleCase(value.designation),
				avg_height: value.average_height + 'cm',
				skin_colors: titleCase(value.skin_colors),
				hair_colors: titleCase(value.hair_colors),
				eye_colors: titleCase(value.eye_colors),
				lifespan: formatLifespan(value.average_lifespan),
				language: titleCase(value.language),
				img_url: './assets/img/species/' + value.name + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/species/" + getIdFromUrl(value.url)
			};
		};

		var formatLifespan = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + ' years';
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};


		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/species/?page=' + page)
					.then(function(response) {
						//console.log(response);
						var speciesResponse = response.data.results;
						var newSpecies = [];
						var totalSpecies;

						newSpecies = speciesResponse.map(function(value){
							return formatSpeciesDetails(value);
						});

						totalSpecies = response.data.count;
						totalSpeciesPages = Math.ceil(totalSpecies / 10);

						species = newSpecies;

						callback(null, species);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('http://swapi.co/api/species/' + id +'/')
					.then(function(response){
						var specie = formatSpeciesDetails(response.data);

						callback(null, specie);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalSpeciesPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.directive('badge', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/badge.html',
			scope: {
				data: "="
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});
angular.module('StarWarsApp')
	.directive('breadcrumbs', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/breadcrumbs.html',
			scope: {
				crumbs: '='
			},
			link: function(scope, element, attr){
				var crumbsString;
				scope.$watch('crumbs', function(newValue, oldValue) {
                	if (newValue){
                		scope.crumbs.forEach(function(item){
                			if(item.hasOwnProperty('url')){
                				crumbsString = '<a href="' + item.url + '">' + item.name + '</a> / ';
                			} else {
                				crumbsString = item.name;
                			}
                			angular.element(document).find('.breadcrumbs').append(crumbsString);
                		});
                	}
            	}, true);
				
			}
		};
	});
angular.module('StarWarsApp')
	.directive('detailsBadge', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/detailsBadge.html',
			transclude: true,
			scope: {
				imgUrl: "=",
				header: "="
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});
angular.module('StarWarsApp')
	.directive('pagination', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/pagination.html',
			scope: {
				currentPage: "=",
				pages: "=",
				action: "&clickAction"
			},
			link: function(scope, element, attr){
				//console.log(scope);
			}
		};
	});
angular.module('StarWarsApp')
	.factory('titleCase', function(){
		return function (string){
			var titledString = [];
			var splitString = string.split(' ');
			splitString.forEach(function(substring){
				var titledSub = substring.charAt(0).toUpperCase() + substring.slice(1);
				titledString.push(titledSub);
			});
			titledString = titledString.join(' ');
			return titledString;
		};
	});