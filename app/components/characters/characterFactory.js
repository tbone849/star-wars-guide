angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var pageNumber = 1;
		var people = [];
		var personDetails = function(value){
			return {
				name: titleCase(value.name),
				name_underscore: titleCase(value.name).split(' ').join('_'),
				birth_year: getYear(value.birth_year),
				hair_color: titleCase(value.hair_color),
				skin_color: titleCase(value.skin_color),
				gender: titleCase(value.gender),
				height: getHeight(value.height),
				mass: getMass(value.mass),
				id: getId(value.url)
			};
		};

		var getMass = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'kg';
		};

		var getHeight = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value + 'cm';
		};

		var getYear = function(value){
			if(value === 'unknown'){
				return 'Unknown';
			}

			return value;
		};

		var getId = function(value){
			var id = value.match(/([0-9])+/g);
			id = id[0];
			return id;
		};

		return {
			getAll: function(callback)	{
				$http.get('http://swapi.co/api/people/?page=' + pageNumber)
					.then(function(response) {
						var peopleResponse = response.data.results;
						var newPeople = [];

						newPeople = peopleResponse.map(function(value){
							return personDetails(value);
						});

						people.push.apply(people, newPeople);

						pageNumber++;
						callback(null, people);
					}, function(err) {
						callback(err);
				});
			},

			getById: function(id, callback){
				$http.get('http://swapi.co/api/people/' + id +'/')
					.then(function(response){
						var person = personDetails(response.data);

						callback(null, person);
					}, function(err){
						callback(err);
				});
			}
		};
	}]);