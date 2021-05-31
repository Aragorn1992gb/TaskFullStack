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
	};
	$scope.fileInsertedInfo = {
		uuid: "",
		key: ""
	};
	$scope.paramsForDecrypt = {
		uuid: "797ea13b-78d8-487b-99f7-8567b012476b",
		key: "kUV2WSpKEPL0UDKTdD148i638hMOSllct68tP7+EQ0G7zNvhLaGaOSLeqsX4i2SdV1PSzt10kn78z7hMFMlaxA=="
	};
	$scope.decryptedFileObj = {
		uuid: "",
		fileName: "",
		size: 0,
		mime: "",
		payload: ""
	};
	
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
		$http({
			method: 'POST',
			url: '/insert/',
			headers: {'Content-Type': 'application/json'},
			data: $scope.fileObj
		}).then(
			function (response) {
				$scope.fileInsertedInfo.uuid = response.data.uuid;
				$scope.fileInsertedInfo.key = response.data.key;
				console.log("SUCCESS"+response.data);
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};

	$scope.decryptFile = function() {
		$http({
			method: 'POST',
			url: '/decrypt/',
			headers: {'Content-Type': 'application/json'},
			data: $scope.paramsForDecrypt
		}).then(
			function (response) {
				$scope.decryptedFileObj = response.data;
				console.log("SUCCESS"+response.data);
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};

	$scope.downloadFile = function(uri, name) {
		var a = document.createElement("a");
		a.download = $scope.decryptedFileObj.fileName;
		a.href = $scope.decryptedFileObj.payload;
		a.click();
		// window.location.href = 'data:'+$scope.decryptedFileObj.mime+'base64,' + $scope.decryptedFileObj.payload;
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