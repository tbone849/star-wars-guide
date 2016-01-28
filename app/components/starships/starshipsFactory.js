angular.module('StarWarsApp')
	.factory('starshipsFactory', ['$http', 'titleCase', function($http, titleCase){

		var starships = [];
		var totalStarshipsPages;
		var formatStarshipsDetails = function(value){
			return {
				name: value.name,
				model: value.model,
				manufacturer: value.manufacturer,
				cost: formatCost(value.cost_in_credits),
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
				img_url: './assets/img/starships/' + value.name + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/starships/" + getIdFromUrl(value.url)
			};
		};

		var formatCost = function(value){
			if(value === 'unknown'){
				return {
					unit: 'Unknown'
				};
			}

			return {
				number: value,
				unit: 'credits'
			};
		};

		var formatSpeed = function(value){
			if(value === 'n/a'){
				console.log(value);
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