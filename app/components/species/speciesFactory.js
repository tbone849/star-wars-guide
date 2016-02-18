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
				$http.get('//swapi.co/api/species/?page=' + page, {cache:true})
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
				$http.get('//swapi.co/api/species/' + id +'/', {cache:true})
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