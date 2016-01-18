angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', 'titleCase', function($http, titleCase){

		var pageNumber = 1;
		var people = [];

		return {
			getAllCharacters: function(callback)	{
				console.log('function called');
				$http.get('http://swapi.co/api/people/?page=' + pageNumber)
					.then(function(response) {
						var peopleResponse = response.data.results;
						var totalPeople = people.length;
						for (x = 0; x < peopleResponse.length; x++){
							people[x + totalPeople] = {
								name: peopleResponse[x].name,
								birth_year: peopleResponse[x].birth_year,
								hair_color: titleCase(peopleResponse[x].hair_color),
								skin_color: titleCase(peopleResponse[x].skin_color),
								gender: titleCase(peopleResponse[x].gender),
								height: peopleResponse[x].height + "cm",
								mass: peopleResponse[x].mass + "kg"
							};
						} // end for loop
						pageNumber++;
						callback(null, people);
					}, function(err) {
						callback(err);
				});
			},

			getCharacterByUrl: function(callback, url){
				$http.get(url).then(function(response){
					var character = {
						name: response.name,
						height: response.height + 'cm',
						mass: response.mass + 'kg',
						hair_color: titleCase(response.hair_color),
						skin_color: titleCase(response.skin_color),
						gender: titleCase(response.gender)
					};
					callback(null, character);
				}, function(err){
					callback(err);
				});
			}
		};
	}]);