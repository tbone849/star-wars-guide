angular.module('StarWarsApp', ['lumx', 'ngRoute', 'underscore'])
	.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];

        $routeProvider.when('/', {
            templateUrl : 'components/categories.html'
        })
        .when('/characters', {
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
angular.module('StarWarsApp')
	.factory('filmFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var films = [];
		var totalFilmPages;

		var formatFilmBasicDetails = function(value){
			return {
				name: 'Episode ' + getRomanNumeral(value.episode_id) + ': ' + value.title,
				img_url: "./assets/img/films/" + getIdFromUrl(value.url) + ".jpg",
				id: parseInt(value.episode_id),
				url: "#/films/" + getIdFromUrl(value.url)
			};
		};

		var formatFilmDetails = function(value){
			return {
				name: 'Episode ' + getRomanNumeral(value.episode_id) + ': ' + value.title,
				director: value.director,
				id: parseInt(value.episode_id),
				crawl: value.opening_crawl,
				producer: value.producer,
				date: formatDate(value.release_date),
				characterUrls: parseUrls(value.characters),
				planetUrls: parseUrls(value.planets),
				starshipUrls: parseUrls(value.starships),
				vehicleUrls: parseUrls(value.vehicles),
				speciesUrls: parseUrls(value.species),
				img_url: "./assets/img/films/" + getIdFromUrl(value.url) + ".jpg",
				url: "#/films/" + getIdFromUrl(value.url)
			};
		};

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});
			return strippedUrls;
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
				$http.get('//swapi.dev/api/films/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var filmResponse = response.data.results;
						var newFilms = [];
						var totalFilms;

						newFilms = filmResponse.map(function(value){
							return formatFilmBasicDetails(value);
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
				$http.get('//swapi.dev/api/films/' + id +'/', {cache:true})
					.then(function(response){
						var film = formatFilmDetails(response.data);

						callback(null, film);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){
				if(!(urls && urls.length)){
					return cb && cb(null, []);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var films = results.map(function(item){
							return formatFilmBasicDetails(item.data);
						});
						cb(null, films);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalFilmPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('filmsController', ['$scope', '$http', 'filmFactory', '_', '$routeParams', function($scope, $http, filmFactory, _, $routeParams){
        
        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Films';
        $scope.currentPage = parseInt($routeParams.page);

		filmFactory.getAll($scope.currentPage, function(err, films) {
            if(err) {
                return console.log(err);
            }
            $scope.films = films;
            var numberOfPages = filmFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);
angular.module('StarWarsApp')
	.controller('characterController', ['$scope', '$http', 'characterFactory', 'planetsFactory', 'speciesFactory', 'wikiaFactory', '$routeParams', function($scope, $http, characterFactory, planetsFactory, speciesFactory, wikiaFactory, $routeParams){
        
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/characters?page=1', name: 'Characters' }
        ];

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;
            //console.log($scope.person);

            planetsFactory.getByUrls(person.homeworld_url, function(err, homeworld){
                if(err) {
                    console.log(err);
                }
                $scope.person.homeworld = homeworld[0];
            });

            speciesFactory.getByUrls(person.speciesUrls, function(err, species){
                if(err) {
                    console.log(err);
                }
                $scope.person.species = species[0];
            });

            // waiting on api key
            //wikiaFactory.getAbstract(person.name, function(err, response){
                //console.log(err);
                //console.log(response);
            //});
            
            
            $scope.pageTitle = $scope.person.name;
        });    
	}]);
angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var people = [];
		var totalCharacterPages;
		var formatPersonBasicDetails = function(value){
			return {
				name: titleCase(value.name),
				img_url: "./assets/img/characters/" + parseInt(getIdFromUrl(value.url)) + ".jpg",
				url: '#/characters/' + getIdFromUrl(value.url)
			};
		};

		var formatPersonDetails = function(value){
			return {
				name: titleCase(value.name),
				birth_year: parseNumber(value.birth_year),
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: parseNumberWithUnit(value.height, 'cm'),
				mass: parseNumberWithUnit(value.mass, 'kg'),
				homeworld_url: parseUrls(value.homeworld),
				filmUrls: parseUrls(value.films),
				speciesUrls: parseUrls(value.species),
				vehicleUrls: parseUrls(value.vehicles),
				starshipUrls: parseUrls(value.starships),
				id: parseInt(getIdFromUrl(value.url)),
				img_url: "./assets/img/characters/" + parseInt(getIdFromUrl(value.url)) + ".jpg",
				url: '#/characters/' + getIdFromUrl(value.url)
			};
		};

		var parseNumberWithUnit = function(value, unit){
			if(isNaN(value)){
				return {
					unit: titleCase(value)
				};
			}

			return {
				number: value,
				unit: unit
			};
		};

		var parseNumber = function(value){
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

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});

			return strippedUrls;
		};

		return {
			getAll: function(page, callback)	{
				$http.get('//swapi.dev/api/people/?page=' + page, {cache:true})
					.then(function(response) {
						var peopleResponse = response.data.results;
						var newPeople = [];
						var totalPeople;

						newPeople = peopleResponse.map(function(value){
							return formatPersonBasicDetails(value);
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
				$http.get('//swapi.dev/api/people/' + id +'/', {cache:true})
					.then(function(response){
						var person = formatPersonDetails(response.data);

						callback(null, person);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){
				if(!(urls && urls.length)){
					return cb && cb(null, []);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var characters = results.map(function(item){
							return formatPersonBasicDetails(item.data);
						});
						cb(null, characters);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalCharacterPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('charactersController', ['$scope', '$http', 'characterFactory', '_', '$routeParams', function($scope, $http, characterFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Characters';
        $scope.currentPage = parseInt($routeParams.page);

		characterFactory.getAll($scope.currentPage, function(err, people) {
            if(err) {
                return console.log(err);
            }
            $scope.characters = people;
            var numberOfPages = characterFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);
angular.module('StarWarsApp')
	.controller('headerController', ['$scope', 'LxDialogService', function($scope, LxDialogService){
		$scope.openDialog = function(dialogId){
			LxDialogService.open(dialogId);
		};
	}]);
angular.module('StarWarsApp')
	.controller('planetController', ['$scope', '$http', 'planetsFactory', '$routeParams', function($scope, $http, planetsFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/planets?page=1', name: 'Planets' }
        ];

		planetsFactory.getById(id, function(err, planet) {
            if(err) {
                return console.log(err);
            }
            $scope.planet = planet;

            $scope.pageTitle = $scope.planet.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('planetsController', ['$scope', '$http', 'planetsFactory', '_', '$routeParams', function($scope, $http, planetsFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Planets';
        $scope.currentPage = parseInt($routeParams.page);

		planetsFactory.getAll($scope.currentPage, function(err, planets) {
            if(err) {
                return console.log(err);
            }
            $scope.planets = planets;
            var numberOfPages = planetsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });
	}]);
angular.module('StarWarsApp')
	.factory('planetsFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var planets = [];
		var totalPlanetsPages;

		var formatPlanetBasicDetails = function(value){
			return {
				name: titleCase(value.name),
				img_url: './assets/img/planets/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				url: "#/planets/" + getIdFromUrl(value.url)
			};
		};

		var formatPlanetsDetails = function(value){
			return {
				name: titleCase(value.name),
				rotation_period: parseNumberWithUnit(value.rotation_period, ' days'),
				orbital_period: parseNumberWithUnit(value.orbital_period, ' days'),
				diameter: parseNumberWithUnit(value.diameter, 'km'),
				climate: titleCase(value.climate),
				gravity: titleCase(value.gravity),
				terrain: titleCase(value.terrain),
				water: parseNumberWithUnit(value.surface_water, '%'),
				population: parseNumber(value.population),
				characterUrls: parseUrls(value.residents),
				filmUrls: parseUrls(value.films),
				img_url: './assets/img/planets/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/planets/" + getIdFromUrl(value.url)
			};
		};

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});
			return strippedUrls;
		};

		var parseNumberWithUnit = function(value, unit){
			if(isNaN(value)){
				return {
					unit: titleCase(value)
				};
			}

			return {
				number: value,
				unit: unit
			};
		};

		var parseNumber = function(value){
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
				$http.get('//swapi.dev/api/planets/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var planetsResponse = response.data.results;
						var newPlanets = [];
						var totalPlanets;

						newPlanets = planetsResponse.map(function(value){
							return formatPlanetBasicDetails(value);
						});

						totalPlanets = response.data.count;
						totalPlanetsPages = Math.ceil(totalPlanets / 10);

						planets = newPlanets;

						callback(null, planets);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('//swapi.dev/api/planets/' + id +'/', {cache:true})
					.then(function(response){
						var planets = formatPlanetsDetails(response.data);

						callback(null, planets);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){
				if(!(urls && urls.length)){
					return cb && cb(null, []);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var planets = results.map(function(item){
							return formatPlanetBasicDetails(item.data);
						});
						cb(null, planets);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalPlanetsPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('specieController', ['$scope', '$http', 'speciesFactory', '$routeParams', function($scope, $http, speciesFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/species?page=1', name: 'Species' },
        ];

		speciesFactory.getById(id, function(err, specie) {
            if(err) {
                return console.log(err);
            }
            $scope.specie = specie;

            $scope.pageTitle = $scope.specie.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('speciesController', ['$scope', '$http', 'speciesFactory', '_', '$routeParams', function($scope, $http, speciesFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' },
        ];
        $scope.pageTitle = 'Species';
        $scope.currentPage = parseInt($routeParams.page);

		speciesFactory.getAll($scope.currentPage, function(err, species) {
            if(err) {
                return console.log(err);
            }
            $scope.species = species;
            var numberOfPages = speciesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);
angular.module('StarWarsApp')
	.factory('speciesFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var species = [];
		var totalSpeciesPages;

		var formatSpeciesBasicDetails = function(value){
			return {
				name: titleCase(value.name),
				img_url: './assets/img/species/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				url: "#/species/" + getIdFromUrl(value.url)
			};
		};

		var formatSpeciesDetails = function(value){
			return {
				name: titleCase(value.name),
				classification: titleCase(value.classification),
				designation: titleCase(value.designation),
				avg_height: parseNumberWithUnit(value.average_height, 'cm'),
				skin_colors: titleCase(value.skin_colors),
				hair_colors: titleCase(value.hair_colors),
				eye_colors: titleCase(value.eye_colors),
				lifespan: parseNumberWithUnit(value.average_lifespan, ' years'),
				language: titleCase(value.language),
				characterUrls: parseUrls(value.people),
				filmUrls: parseUrls(value.films),
				img_url: './assets/img/species/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/species/" + getIdFromUrl(value.url)
			};
		};

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});
			return strippedUrls;
		};

		var parseNumberWithUnit = function(value, unit){
			if(isNaN(value)){
				return {
					unit: titleCase(value)
				};
			}

			return {
				number: value,
				unit: unit
			};
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};


		return {
			getAll: function(page, callback)	{
				$http.get('//swapi.dev/api/species/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var speciesResponse = response.data.results;
						var newSpecies = [];
						var totalSpecies;

						newSpecies = speciesResponse.map(function(value){
							return formatSpeciesBasicDetails(value);
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
				$http.get('//swapi.dev/api/species/' + id +'/', {cache:true})
					.then(function(response){
						var specie = formatSpeciesDetails(response.data);

						callback(null, specie);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){
				if(!urls.length){
					var fallback = [
						{name: 'Unknown', url: ''}
					];
					return cb && cb(null, fallback);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var species = results.map(function(item){
							return formatSpeciesBasicDetails(item.data);
						});
						cb(null, species);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalSpeciesPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('starshipController', ['$scope', '$http', 'starshipsFactory', '$routeParams', function($scope, $http, starshipsFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/starships?page=1', name: 'Starships' }
        ];

		starshipsFactory.getById(id, function(err, starship) {
            if(err) {
                return console.log(err);
            }
            $scope.starship = starship;

            $scope.pageTitle = $scope.starship.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('starshipsController', ['$scope', '$http', 'starshipsFactory', '_', '$routeParams', function($scope, $http, starshipsFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Starships';
        $scope.currentPage = parseInt($routeParams.page);

		starshipsFactory.getAll($scope.currentPage, function(err, starships) {
            if(err) {
                return console.log(err);
            }
            $scope.starships = starships;
            var numberOfPages = starshipsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);
angular.module('StarWarsApp')
	.factory('starshipsFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var starships = [];
		var totalStarshipsPages;

		var formatStarshipBasicDetails = function(value){
			return {
				name: value.name,
				img_url: './assets/img/starships/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				url: "#/starships/" + getIdFromUrl(value.url)
			};
		};

		var formatStarshipsDetails = function(value){
			return {
				name: value.name,
				model: value.model,
				manufacturer: value.manufacturer,
				cost: parseNumberWithUnit(value.cost_in_credits, ' credits'),
				length: {
					number: value.length.replace(/,/g,''),
					unit: 'm'
				},
				speed: formatSpeed(value.max_atmosphering_speed),
				min_crew: value.crew,
				passengers: value.passengers,
				cargo_capacity: formatWeight(value.cargo_capacity),
				consumables: value.consumables,
				hyperdrive_rating: value.hyperdrive_rating,
				mglt: value.MGLT,
				shipclass: titleCase(value.starship_class),
				characterUrls: parseUrls(value.pilots),
				filmUrls: parseUrls(value.films),
				img_url: './assets/img/starships/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/starships/" + getIdFromUrl(value.url)
			};
		};

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});
			return strippedUrls;
		};

		var parseNumberWithUnit = function(value, unit){
			if(isNaN(value)){
				return {
					unit: titleCase(value)
				};
			}

			return {
				number: value,
				unit: unit
			};
		};

		var parseNumber = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value;
		};

		var formatSpeed = function(value){
			if(value === 'n/a'){
				return {
					unit: value
				};
			} else if (value.includes('km')){
				return {
					number: value.match(/\d/g).join(''),
					unit: 'km/h'
				};
			}

			return {
				number: value,
				unit: 'km/h'
			};
		};

		var formatWeight = function(value){
			if(parseInt(value) > 1000){
				return {
					number: (parseInt(value) / 1000).toFixed(),
					unit: ' metric tons'
				};
			}

			return {
				number: value,
				unit: 'kg'
			};
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};


		return {
			getAll: function(page, callback){
				$http.get('//swapi.dev/api/starships/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var starshipsResponse = response.data.results;
						var newStarships = [];
						var totalStarships;

						newStarships = starshipsResponse.map(function(value){
							return formatStarshipBasicDetails(value);
						});

						totalStarships = response.data.count;
						totalStarshipsPages = Math.ceil(totalStarships / 10);

						starships = newStarships;

						callback(null, starships);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('//swapi.dev/api/starships/' + id +'/', {cache:true})
					.then(function(response){
						var starships = formatStarshipsDetails(response.data);

						callback(null, starships);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){

				if(!(urls && urls.length)){
					return cb && cb(null, []);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var starships = results.map(function(item){
							return formatStarshipBasicDetails(item.data);
						});
						cb(null, starships);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalStarshipsPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('vehicleController', ['$scope', '$http', 'vehiclesFactory', '$routeParams', function($scope, $http, vehiclesFactory, $routeParams){
        var id = $routeParams.id;
        $scope.crumbs = [
            { url: '#/', name: 'Home' },
            { url: '#/vehicles?page=1', name: 'Vehicles' }
        ];

		vehiclesFactory.getById(id, function(err, vehicle) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicle = vehicle;

            $scope.pageTitle = $scope.vehicle.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('vehiclesController', ['$scope', '$http', 'vehiclesFactory', '_', '$routeParams', function($scope, $http, vehiclesFactory, _, $routeParams){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Vehicles';
        $scope.currentPage = parseInt($routeParams.page);

		vehiclesFactory.getAll($scope.currentPage, function(err, vehicles) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicles = vehicles;
            var numberOfPages = vehiclesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });         
	}]);
angular.module('StarWarsApp')
	.factory('vehiclesFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var vehicles = [];
		var totalVehiclesPages;

		var formatVehicleBasicDetails = function(value){
			return {
				name: value.name,
				img_url: './assets/img/vehicles/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				url: "#/vehicles/" + getIdFromUrl(value.url)
			};
		};

		var formatVehiclesDetails = function(value){
			return {
				name: value.name,
				model: value.model,
				manufacturer: value.manufacturer,
				cost: parseNumberWithUnit(value.cost_in_credits, ' credits'),
				length: {
					number: value.length.replace(/,/g,''),
					unit: 'm'
				},
				speed: formatSpeed(value.max_atmosphering_speed),
				min_crew: parseNumber(value.crew),
				passengers: parseNumber(value.passengers),
				cargo_capacity: formatWeight(value.cargo_capacity),
				consumables: titleCase(value.consumables),
				vehicle_class: titleCase(value.vehicle_class),
				characterUrls: parseUrls(value.pilots),
				filmUrls: parseUrls(value.films),
				img_url: './assets/img/vehicles/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/vehicles/" + getIdFromUrl(value.url)
			};
		};

		var parseNumberWithUnit = function(value, unit){
			if(isNaN(value)){
				return {
					unit: titleCase(value)
				};
			}

			return {
				number: value,
				unit: unit
			};
		};

		var parseNumber = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value;
		};

		var formatSpeed = function(value){
			if(value === 'n/a'){
				return {
					unit: value
				};
			} else if (value.includes('km')){
				return {
					number: value.match(/\d/g).join(''),
					unit: 'km/h'
				};
			}

			return {
				number: value,
				unit: 'km/h'
			};
		};

		var formatWeight = function(value){
			if(parseInt(value) > 1000){
				return {
					number: (parseInt(value) / 1000).toFixed(),
					unit: ' metric tons'
				};
			}

			return {
				number: value,
				unit: 'kg'
			};
		};

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};

		var parseUrls = function(value){
			var urls = [];
			var strippedUrls = [];
			if(value instanceof Array ){
				urls = value;
			} else {
				urls = [value];
			}
			strippedUrls = urls.map(function(url){
				return url.replace(/.*?:/g, "");
			});
			return strippedUrls;
		};


		return {
			getAll: function(page, callback)	{
				$http.get('//swapi.dev/api/vehicles/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var vehiclesResponse = response.data.results;
						var newVehicles = [];
						var totalVehicles;

						newVehicles = vehiclesResponse.map(function(value){
							return formatVehicleBasicDetails(value);
						});

						totalVehicles = response.data.count;
						totalVehiclesPages = Math.ceil(totalVehicles / 10);

						vehicles = newVehicles;

						callback(null, vehicles);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('//swapi.dev/api/vehicles/' + id +'/', {cache:true})
					.then(function(response){
						var vehicles = formatVehiclesDetails(response.data);

						callback(null, vehicles);
					}, function(err){
						callback(err);
				});
			},

			getByUrls: function(urls, cb){
				if(!(urls && urls.length)){
					return cb && cb(null, []);
				}

				var urlCalls = urls.map(function(url) {
					return $http.get(url, {cache:true});
				});

				$q.all(urlCalls, cb)
					.then(function(results) {
						var vehicles = results.map(function(item){
							return formatVehicleBasicDetails(item.data);
						});
						cb(null, vehicles);
					},
					function(err) {
						cb(err);
					}
				);
			},

			getNumberOfPages: function(){
				return totalVehiclesPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.factory('wikiaFactory', ['$http', function($http){

		return {
			getAbstract: function(search, cb){
				$http.jsonp('http://starwars.wikia.com/api/v1/Search/List/?callback=JSON_CALLBACK&limit=1&query=' + search)
					.then(function(response){
						cb(null, response);
					}, function(err){
						cb(err);
					});
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
				crumbs: '=',
				pageTitle: '@'
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
	.directive('pagination', ['$location', '_', function($location, _){
		return {
			restrict: 'E',
			templateUrl: './directives/pagination.html',
			scope: {
				currentPage: "=",
				pages: "="
			},
			link: function(scope, element, attr){

				scope.$watch('pages', function(newValue){
					if(newValue){
						if(scope.currentPage < 4 || scope.pages.length < 6){
							scope.start = 0;
						} else if(scope.pages.length - scope.currentPage < 3){
								scope.start = scope.pages.length - 5;
						} else {
							scope.start = scope.currentPage - 3;
						}
					}
					
				});

				scope.isCurrentPage = function(number){
					return (number === parseInt(scope.currentPage));
				};

				scope.getNewPage = function(newPageNumber){
					$location.search('page', newPageNumber);
				};


			}
		};
	}]);
angular.module('StarWarsApp')
	.directive('relatedLinks', function(){
		return {
			restrict: 'E',
			templateUrl: './directives/relatedLinks.html',
			scope: {
				header: "@",
				factory: '=',
				urls: '='
			},
			link: function(scope, element, attrs){
				scope.currentPage = 1;
				scope.hasError = false;
				scope.hasData = false;
				scope.loaded = false;
				console.log(scope.loaded);
				var factory = element.injector().get(attrs.factory);
				var items = [];
				var slicePosition = 0;

				scope.loadNext = function(){
					scope.currentPage++;
					slicePosition += 5;
					if(scope.currentPage === scope.totalPages){
						scope.chunk = items.slice(slicePosition);
					} else {
						scope.chunk = items.slice(slicePosition, slicePosition + 5);
					}
				};

				scope.loadPrevious = function(){
					scope.currentPage--;
					slicePosition -= 5;
					scope.chunk = items.slice(slicePosition, slicePosition + 5);
				};

				var getByUrls = function(urls){
					factory.getByUrls(urls, function(err, data){
						if(err){
							scope.loaded = true;
							scope.hasError = true;
							scope.err = 'An error occured. Please try again later.';
							return console.log(err);
						} else if(data && data.length){
							scope.loaded = true;
							scope.hasData = true;
							items = data;
							scope.totalPages = Math.ceil(items.length / 5);
							scope.chunk = items.slice(slicePosition, 5);
						} else if(urls.length === 0) {
							scope.loaded = true;
						}
					});
				};

				scope.$watch('urls', function(newUrls, oldValue){
					if(newUrls === oldValue){
						if(typeof newUrls !== 'undefined'){
							getByUrls(newUrls);
						}
					} else {
						getByUrls(newUrls);
					} // end if	
				});
			} // end return
		};
	});
angular.module('StarWarsApp')
	.factory('titleCase', function(){
		return function (string){
			var titledString = [];
			var splitString = string.split(' ');
			splitString.forEach(function(substring){
				if(substring === 'n/a'){
					titledString.push(substring);
				} else {
					var titledSub = substring.charAt(0).toUpperCase() + substring.slice(1);
					titledString.push(titledSub);
				}	
			});
			titledString = titledString.join(' ');
			return titledString;
		};
	});
angular.module('StarWarsApp').
	filter('textOrNumber', ['$filter', function ($filter) {
	    return function (input, fractionSize) {
	        if (isNaN(input)) {
	            return input;
	        } else {
	            return $filter('number')(input, fractionSize);
	        }
	    };
	}]);