angular.module('StarWarsApp')
	.factory('characterFactory', ['$http', function($http){
		function titleCase(string){
			var titledString = string.replace(/\b(\w)/g, function(letter){
				return letter.toUpperCase();
			});

			return titledString;
		}

		function getHomeworldName(url, index, people){
			$http.get(url).then(function(response){
				people[index].homeworld = response.data.name;
			}, function(){
				people[index].homeworld = "error";
			});
		}

		function getFilmNames(url, index, people){
			$http.get(url).then(function(response){
				people[index].films = response.title;
			}, function(){
				people[index].films = "error";
			});
		}
		

		return {
			getCharacters: function(callback)	{
				$http.get('http://swapi.co/api/people/')
					.then(function(response) {
						console.log(response);
						var peopleResponse = response.data.results;
						var people = [];
						for (x = 0; x < peopleResponse.length; x++){
							people[x] = {
								name: peopleResponse[x].name,
								birth_year: peopleResponse[x].birth_year,
								hair_color: titleCase(peopleResponse[x].hair_color),
								skin_color: titleCase(peopleResponse[x].skin_color),
								gender: titleCase(peopleResponse[x].gender),
								height: peopleResponse[x].height + "cm",
								mass: peopleResponse[x].mass + "kg",
							};
							getHomeworldName(peopleResponse[x].homeworld, x, people);
						} // end for loop
						callback(null, people);
					}, function(err) {
						callback(err);
				});
			}
		};
	}]);