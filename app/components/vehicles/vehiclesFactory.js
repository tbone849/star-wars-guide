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
				img_url: './assets/img/vehicles/' + value.name + '.jpg',
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