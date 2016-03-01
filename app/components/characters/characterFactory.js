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
				$http.get('//swapi.co/api/people/?page=' + page, {cache:true})
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
				$http.get('//swapi.co/api/people/' + id +'/', {cache:true})
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