var app = angular.module('app', []);
 
//#######################
//JSA CONTROLLER
//#######################
 
app.controller('jsaLoadCustomers', function($scope, $http, $location) {

	
	  
	$scope.customers = [];
	$scope.fileObj = {
		name: "",
		size: 0,
		mime: "",
		payload: ""
	}
	
	function getAllCustomers(){
		var url = "api/customers/all";
		
		// do getting
		$http.get(url).then( response => {
			$scope.getDivAvailable = true;
			$scope.customers = response.data;
		}, response => {
			$scope.postResultMessage = "Error Status: " +  response.statusText;
		});
	}

	$scope.submitForm = function() {
		console.log("cliccato",$scope.fileObj);

		$http({
			method: 'POST',
			url: '/insert/',
			headers: {'Content-Type': 'application/json'},
			data: $scope.fileObj
		}).then(
			function (response) {
				var data = response.data;
				console.log("SUCCESS"+response.data);
			}, function (error) {
				var data = error.data;
				console.log("ERROR"+error.data);
		});
	};

	openFile = function(event) {
		var input = event.target;
	
		var reader = new FileReader();
		reader.onload = function(){
		  var dataURL = reader.result;
		  var output = document.getElementById('output');
		  output.src = dataURL;
		  $scope.fileObj.name = input.files[0].name;
		  $scope.fileObj.size = input.files[0].size;
		  $scope.fileObj.mime = input.files[0].type+";";
		  $scope.fileObj.payload = dataURL; // here the bytearray image.It can be shown using output.src
		  console.log("File: ",$scope.fileObj);
		};
		reader.readAsDataURL(input.files[0]);
	  };
	
	getAllCustomers();
});