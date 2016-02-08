angular.module('StarWarsApp')
	.factory('filmFactory', ['$http', '$q', 'titleCase', function($http, $q, titleCase){

		var films = [];
		var totalFilmPages;

		var formatFilmBasicDetails = function(value){
			return {
				name: 'Episode ' + getRomanNumeral(value.episode_id) + ': ' + value.title,
				img_url: "./assets/img/films/" + getIdFromUrl(value.url) + ".jpg",
				id: parseInt(value.episode_id),
				url: "#/films/" + getIdFromUrl(value.url)
			};
		};

		var formatFilmDetails = function(value){
			return {
				name: 'Episode ' + getRomanNumeral(value.episode_id) + ': ' + value.title,
				director: value.director,
				id: parseInt(value.episode_id),
				crawl: value.opening_crawl,
				producer: value.producer,
				date: formatDate(value.release_date),
				characterUrls: parseUrls(value.characters),
				planetUrls: parseUrls(value.planets),
				starshipUrls: parseUrls(value.starships),
				vehicleUrls: parseUrls(value.vehicles),
				speciesUrls: parseUrls(value.species),
				img_url: "./assets/img/films/" + getIdFromUrl(value.url) + ".jpg",
				url: "#/films/" + getIdFromUrl(value.url)
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
				$http.get('//swapi.co/api/films/?page=' + page, {cache:true})
					.then(function(response) {
						//console.log(response);
						var filmResponse = response.data.results;
						var newFilms = [];
						var totalFilms;

						newFilms = filmResponse.map(function(value){
							return formatFilmBasicDetails(value);
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
				$http.get('//swapi.co/api/films/' + id +'/', {cache:true})
					.then(function(response){
						var film = formatFilmDetails(response.data);

						callback(null, film);
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
						var films = results.map(function(item){
							return formatFilmBasicDetails(item.data);
						});
						cb(null, films);
					},
					function(err) {
						cb(err);
					}
				);
			},  

			getNumberOfPages: function(){
				return totalFilmPages;
			}
		};
	}]);