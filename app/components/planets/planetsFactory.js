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
				$http.get('//swapi.co/api/planets/?page=' + page, {cache:true})
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
				$http.get('//swapi.co/api/planets/' + id +'/', {cache:true})
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