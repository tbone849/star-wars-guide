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
				$http.get('//swapi.co/api/vehicles/?page=' + page, {cache:true})
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
				$http.get('//swapi.co/api/vehicles/' + id +'/', {cache:true})
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