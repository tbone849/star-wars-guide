angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', 'urlsFactory', function($http, titleCase, urlsFactory){

		var people = [];
		var totalCharacterPages;
		var formatPersonBasicInfo = function(value){
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
			} else if (category === 'species' || category === 'characters' || category === 'vehicles' || category === 'starships' || category === 'planets' || category ==='planets'){
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
						// get related homeworld
						var planet = [response.data.homeworld];
						urlsFactory.getRelatedData(planet,function(err, planets){
							if(err){
								person.planets.error = 'Error retrieving planets.';
								console.log(err);
								return;
							}
							var relatedPlanets = parseRelated(planets, 'planets');
							person.planets = relatedPlanets;
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