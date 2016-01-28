angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var people = [];
		var totalCharacterPages;
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

		return {
			getAll: function(page, callback)	{
				$http.get('http://swapi.co/api/people/?page=' + page, {cache:true})
					.then(function(response) {
						var peopleResponse = response.data.results;
						var newPeople = [];
						var totalPeople;

						newPeople = peopleResponse.map(function(value){
							return formatPersonDetails(value);
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