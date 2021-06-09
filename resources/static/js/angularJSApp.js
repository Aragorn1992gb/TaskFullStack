var app = angular.module('app', []);
 
app.service('Lang', function() {
    var language = localStorage.getItem("language");

    if (language == null){
        window.localStorage.setItem("language", "crypto");
    }
     
    this.setlang = function(lang) {
        language = lang;
        window.localStorage.setItem("language", lang);
    };
    
    this.getlang = function() {
        if (language == null){
            language = param;
            return language;
        }
        return language;
    };
});

app.constant('CONSTANTS', {
    languages: {
		eng: "english",
		crypto: "crypto"
	},
});

angular.module("app").directive("selectNgFiles", function() {
	return {
	  require: "ngModel",
	  link: function postLink(scope,elem,attrs,ngModel) {
		elem.on("change", function(e) {
		  var files = elem[0].files;
		  ngModel.$setViewValue(files);
		})
	  }
	}
  });
 
app.controller('jsaLoadCustomers', function($scope, $http, $location, Lang, CONSTANTS, TRANSLATION_ENGLISH, TRANSLATION_CRYPTO) {

	var language = Lang.getlang(CONSTANTS.languages.crypto);


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

	

	$(function() {
		$("#"+language).addClass("button-header-selected");
	});
	 

	

	// $scope.submitForm = function() {
	// 	$http({
	// 		method: 'POST',
	// 		url: '/insert/',
	// 		headers: {'Content-Type': 'application/json'},
	// 		data: $scope.fileObj
	// 	}).then(
	// 		function (response) {
	// 			$scope.fileInsertedInfo.uuid = response.data.uuid;
	// 			$scope.fileInsertedInfo.key = response.data.key;
	// 			console.log("SUCCESS"+response.data);
	// 			window.location.href = "http://localhost:8080/encrypted";
	// 		}, function (error) {
	// 			console.log("ERROR"+error.data);
	// 	});
	// };

	$scope.submitForm = function() {
		$http({
			method: 'POST',
			url: '/encrypt/',
			headers: {'Content-Type': 'application/json'},
			data: $scope.fileObj
		}).then(
			function (response) {
				console.log("ok");
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};
	// };

	// $scope.submitForm = function() {
	// 	console.log("asdas",$scope.file);
	// 	app.get('/encrypted/', "hello");
	// 	// window.location.href = "http://localhost:8080/encrypted/"+$scope.fileObj;
	// };
	

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
		//   var output = document.getElementById('output');
		//   output.src = dataURL;
		  $scope.fileObj.name = input.files[0].name;
		  $scope.fileObj.size = input.files[0].size;
		  $scope.fileObj.mime = input.files[0].type+";";
		  $scope.fileObj.payload = dataURL; // here the bytearray image.It can be shown using output.src
		  console.log("File: ",$scope.fileObj);
		};
		reader.readAsDataURL(input.files[0]);
	  };

	$scope.changeLanguage = function(event) {
		
		$scope.selectedLanguage = event.srcElement.id;

		if($scope.selectedLanguage != language){
			Lang.setlang($scope.selectedLanguage);
			location.reload();
		}

	};

	translateMessage =  function(msg) {
        return eval("TRANSLATION_"+language.toUpperCase()+"."+msg);    
    } 

	$scope.indexTitle = translateMessage("index_title");
	$scope.indexDescription = translateMessage("index_description");
	$scope.listboxTitle = translateMessage("listbox_title");
	$scope.footerDescription = translateMessage("footer_description");
	$scope.uploadedLabel = "";

	// $scope.inputfile = $("#inputfile").val();

	$scope.$watch('inputfile', function () {
		if($scope.inputfile[0]){
			$scope.uploadedLabel = $scope.inputfile[0].name;
			// $("#uploadedLabel").text($scope.inputfile[0].name);
			$("#file").addClass("hidden");
			$("#biginfo").addClass("hidden");
			$("#uploadedIco").removeClass("hidden");
			$("#uploadedLabel").removeClass("hidden");
		}
	});


});





app.controller('encryptedCtrl', function($scope, $http, $location, Lang, CONSTANTS, TRANSLATION_ENGLISH, TRANSLATION_CRYPTO) {

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
				window.location.href = "http://localhost:8080/encrypted";
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};
});
