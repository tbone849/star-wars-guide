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
				$http.get('//swapi.co/api/starships/?page=' + page, {cache:true})
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
				$http.get('//swapi.co/api/starships/' + id +'/', {cache:true})
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