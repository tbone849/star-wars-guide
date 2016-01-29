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
	.controller('characterController', ['$scope', '$http', 'characterFactory', '$routeParams', function($scope, $http, characterFactory, $routeParams){
        var id = $routeParams.id;

		characterFactory.getById(id, function(err, person) {
            if(err) {
                return console.log(err);
            }
            $scope.person = person;
            console.log($scope.person);
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/characters', name: 'Characters' }
            ];
            $scope.pageTitle = $scope.person.name;
        });    
	}]);
angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', 'urlsFactory', function($http, titleCase, urlsFactory){

		var people = [];
		var totalCharacterPages;
		var formatPersonBasicInfo = function(value){
			return {
				name: titleCase(value.name),
				img_url: "./assets/img/characters/" + parseInt(getIdFromUrl(value.url)) + ".jpg",
				url: '#/characters/' + getIdFromUrl(value.url)
			}
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

		var parseRelated = function(items, category){
			if(category === 'films'){
				var films = items.map(function(item){
					return {
						name: item.data.title,
						url: '#/films/' + getIdFromUrl(item.data.url)
					};
				});
				return films;
			} else if (category === 'species' || category === 'characters' || category === 'vehicles' || category === 'starships' || category === 'planets'){
				var related = items.map(function(item){
					return {
						name: item.data.name,
						url: '#/' + category + '/' + getIdFromUrl(item.data.url)
					};
				});
				return related;
			}
		};

		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/people/?page=' + page, {cache:true})
					.then(function(response) {
						var peopleResponse = response.data.results;
						var newPeople = [];
						var totalPeople;

						newPeople = peopleResponse.map(function(value){
							return formatPersonBasicInfo(value);
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
				$http.get('http://swapi.co/api/people/' + id +'/', {cache:true})
					.then(function(response){
						var person = formatPersonDetails(response.data);
						// get related films
						urlsFactory.getRelatedData(response.data.films,function(err, films){
							if(err){
								person.films.error = 'Error retrieving films.';
								console.log(err);
								return;
							}
							var relatedFilms = parseRelated(films, 'films');
							person.films = relatedFilms;
						});
						// get related species
						urlsFactory.getRelatedData(response.data.species,function(err, species){
							if(err){
								person.species.error = 'Error retrieving species.';
								console.log(err);
								return;
							}
							var relatedSpecies = parseRelated(species, 'species');
							person.species = relatedSpecies;
						});
						// get related vehicles
						urlsFactory.getRelatedData(response.data.vehicles,function(err, vehicles){
							if(err){
								person.vehicles.error = 'Error retrieving vehicles.';
								console.log(err);
								return;
							}
							var relatedVehicles = parseRelated(vehicles, 'vehicles');
							person.vehicles = relatedVehicles;
						});
						// get related starships
						urlsFactory.getRelatedData(response.data.starships,function(err, starships){
							if(err){
								person.starships.error = 'Error retrieving starships.';
								console.log(err);
								return;
							}
							var relatedStarships = parseRelated(starships, 'starships');
							person.starships = relatedStarships;
						});
						
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

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Characters';

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
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/films', name: 'Films' }
            ];
            $scope.pageTitle = $scope.film.name;
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
				img_url: "./assets/img/films/" + getIdFromUrl(value.url) + ".jpg",
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
				$http.get('http://swapi.co/api/films/?page=' + page, {cache:true})
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
				$http.get('http://swapi.co/api/films/' + id +'/', {cache:true})
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
        
        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Films';

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
	.controller('planetController', ['$scope', '$http', 'planetsFactory', '$routeParams', function($scope, $http, planetsFactory, $routeParams){
        var id = $routeParams.id;

		planetsFactory.getById(id, function(err, planet) {
            if(err) {
                return console.log(err);
            }
            $scope.planet = planet;
            console.log($scope.planet);
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/planets', name: 'Planets' }
            ];
            $scope.pageTitle = $scope.planet.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('planetsController', ['$scope', '$http', 'planetsFactory', '_', '$cookies', function($scope, $http, planetsFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Planets';
        
        var pageCache = $cookies.get('currentPlanetsPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		planetsFactory.getAll($scope.currentPage, function(err, planets) {
            if(err) {
                return console.log(err);
            }
            $scope.planets = planets;
            var numberOfPages = planetsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentPlanetsPage', newPageNumber);
            planetsFactory.getAll(newPageNumber, function(err, planets) {
                if(err) {
                    return console.log(err);
                }
                $scope.planets = planets;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('planetsFactory', ['$http', 'titleCase', function($http, titleCase){

		var planets = [];
		var totalPlanetsPages;
		var formatPlanetsDetails = function(value){
			return {
				name: value.name,
				rotation_period: parseNumberWithUnit(value.rotation_period, ' days'),
				orbital_period: parseNumberWithUnit(value.orbital_period, ' days'),
				diameter: parseNumberWithUnit(value.diameter, 'km'),
				climate: titleCase(value.climate),
				gravity: titleCase(value.gravity),
				terrain: titleCase(value.terrain),
				water: parseNumberWithUnit(value.surface_water, '%'),
				population: parseNumber(value.population),
				img_url: './assets/img/planets/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/planets/" + getIdFromUrl(value.url)
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


		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/planets/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var planetsResponse = response.data.results;
						var newPlanets = [];
						var totalPlanets;

						newPlanets = planetsResponse.map(function(value){
							return formatPlanetsDetails(value);
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
				$http.get('http://swapi.co/api/planets/' + id +'/', {cache:true})
					.then(function(response){
						var planets = formatPlanetsDetails(response.data);

						callback(null, planets);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalPlanetsPages;
			}
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
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/species', name: 'Species' },
            ];
            $scope.pageTitle = $scope.specie.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('speciesController', ['$scope', '$http', 'speciesFactory', '_', '$cookies', function($scope, $http, speciesFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' },
        ];
        $scope.pageTitle = 'Species';

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
				lifespan: parseNumberWithUnit(value.average_lifespan, ' years'),
				language: titleCase(value.language),
				img_url: './assets/img/species/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/species/" + getIdFromUrl(value.url)
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

		var getIdFromUrl = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};


		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/species/?page=' + page, {cache:true})
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
				$http.get('http://swapi.co/api/species/' + id +'/', {cache:true})
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
	.controller('starshipController', ['$scope', '$http', 'starshipsFactory', '$routeParams', function($scope, $http, starshipsFactory, $routeParams){
        var id = $routeParams.id;

		starshipsFactory.getById(id, function(err, starship) {
            if(err) {
                return console.log(err);
            }
            $scope.starship = starship;
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/starships', name: 'Starships' }
            ];
            $scope.pageTitle = $scope.starship.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('starshipsController', ['$scope', '$http', 'starshipsFactory', '_', '$cookies', function($scope, $http, starshipsFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Starships';
        
        var pageCache = $cookies.get('currentStarshipsPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		starshipsFactory.getAll($scope.currentPage, function(err, starships) {
            if(err) {
                return console.log(err);
            }
            $scope.starships = starships;
            var numberOfPages = starshipsFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentStarshipsPage', newPageNumber);
            starshipsFactory.getAll(newPageNumber, function(err, starships) {
                if(err) {
                    return console.log(err);
                }
                $scope.starships = starships;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('starshipsFactory', ['$http', 'titleCase', function($http, titleCase){

		var starships = [];
		var totalStarshipsPages;
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
				img_url: './assets/img/starships/' + parseInt(getIdFromUrl(value.url)) + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/starships/" + getIdFromUrl(value.url)
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


		return {
			getAll: function(page, callback){
				$http.get('http://swapi.co/api/starships/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var starshipsResponse = response.data.results;
						var newStarships = [];
						var totalStarships;

						newStarships = starshipsResponse.map(function(value){
							return formatStarshipsDetails(value);
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
				$http.get('http://swapi.co/api/starships/' + id +'/', {cache:true})
					.then(function(response){
						var starships = formatStarshipsDetails(response.data);

						callback(null, starships);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalStarshipsPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.controller('vehicleController', ['$scope', '$http', 'vehiclesFactory', '$routeParams', function($scope, $http, vehiclesFactory, $routeParams){
        var id = $routeParams.id;

		vehiclesFactory.getById(id, function(err, vehicle) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicle = vehicle;
            $scope.crumbs = [
            	{ url: '#/', name: 'Home' },
            	{ url: '#/vehicles', name: 'Vehicles' }
            ];
            $scope.pageTitle = $scope.vehicle.name;
        });    
	}]);
angular.module('StarWarsApp')
	.controller('vehiclesController', ['$scope', '$http', 'vehiclesFactory', '_', '$cookies', function($scope, $http, vehiclesFactory, _, $cookies){

        $scope.crumbs = [
            { url: '#/', name: 'Home' }
        ];
        $scope.pageTitle = 'Vehicles';
        
        var pageCache = $cookies.get('currentVehiclesPage');
        if(pageCache){
            $scope.currentPage = pageCache;
        } else {
            $scope.currentPage = 1;
        }

		vehiclesFactory.getAll($scope.currentPage, function(err, vehicles) {
            if(err) {
                return console.log(err);
            }
            $scope.vehicles = vehicles;
            var numberOfPages = vehiclesFactory.getNumberOfPages();
            $scope.pages = _.range(1, numberOfPages+1);
        });

        $scope.getNewPage = function(newPageNumber){
            $cookies.put('currentVehiclesPage', newPageNumber);
            vehiclesFactory.getAll(newPageNumber, function(err, vehicles) {
                if(err) {
                    return console.log(err);
                }
                $scope.vehicles = vehicles;
                $scope.currentPage = newPageNumber;

            });
        };
         
	}]);
angular.module('StarWarsApp')
	.factory('vehiclesFactory', ['$http', 'titleCase', function($http, titleCase){

		var vehicles = [];
		var totalVehiclesPages;
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


		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/vehicles/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var vehiclesResponse = response.data.results;
						var newVehicles = [];
						var totalVehicles;

						newVehicles = vehiclesResponse.map(function(value){
							return formatVehiclesDetails(value);
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
				$http.get('http://swapi.co/api/vehicles/' + id +'/', {cache:true})
					.then(function(response){
						var vehicles = formatVehiclesDetails(response.data);

						callback(null, vehicles);
					}, function(err){
						callback(err);
				});
			}, 

			getNumberOfPages: function(){
				return totalVehiclesPages;
			}
		};
	}]);
angular.module('StarWarsApp')
	.factory('urlsFactory', ['$http', '$q', function($http, $q){
		return {
			getRelatedData: function(urls, cb){

				var urlCalls = [];
				angular.forEach(urls, function(url) {
					urlCalls.push($http.get(url, {cache:true}));
				});

				$q.all(urlCalls)
					.then(function(results) {
						cb(null, results);
					},
					function(errors) {
						cb(errors);
					}
				);
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
				scope.isCurrentPage = function(number){
					return (number === parseInt(scope.currentPage));
				};				
			}
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
	filter('textOrNumber', function ($filter) {
	    return function (input, fractionSize) {
	        if (isNaN(input)) {
	            return input;
	        } else {
	            return $filter('number')(input, fractionSize);
	        }
	    };
	});