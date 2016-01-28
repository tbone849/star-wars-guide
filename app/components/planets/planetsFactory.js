angular.module('StarWarsApp')
	.factory('planetsFactory', ['$http', 'titleCase', function($http, titleCase){

		var planets = [];
		var totalPlanetsPages;
		var formatPlanetsDetails = function(value){
			return {
				name: value.name,
				rotation_period: value.rotation_period + 'days',
				orbital_period: value.orbital_period + 'days',
				diameter: {number: value.diameter, unit: 'km'},
				climate: titleCase(value.climate),
				gravity: value.gravity,
				terrain: titleCase(value.terrain),
				water: value.surface_water + '%',
				population: value.population,
				img_url: './assets/img/planets/' + value.name + '.jpg',
				id: parseInt(getIdFromUrl(value.url)),
				url: "#/planets/" + getIdFromUrl(value.url)
			};
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