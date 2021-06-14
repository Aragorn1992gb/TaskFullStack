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
	env: {
		url: "http://localhost:8080/"
	},
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
		key: "",
		name: ""
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
				$scope.fileInsertedInfo.name = response.data.name;
				console.log("SUCCESS"+JSON.stringify(response));
				$scope.goToEncryptedPage($scope.fileInsertedInfo);
			}, function (error) {
				console.log("ERROR");
		});
	};

	$scope.goToEncryptedPage = function(info) {
		console.log(info);
		$http({
			method: 'POST',
			url: '/encrypt/',
			headers: {'Content-Type': 'application/json'},
			data: info
		}).then(
			function (response) {
				console.log("ok");
				window.location.href = CONSTANTS.env.url+"encrypted";
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};

	$scope.decryptFile = function() {
		window.location.href = CONSTANTS.env.url+"decryptfile";
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

	var language = Lang.getlang(CONSTANTS.languages.crypto);

	$scope.fileInsertedInfo = {
		uuid: "",
		key: "",
		name: ""
	};

	$(function() {
		$("#"+language).addClass("button-header-selected");
	});

	$scope.getFileInfo = function() {
		$http({
			method: 'GET',
			url: '/getFileInfo/'
		}).then(
			function (response) {
				if(response.data.uuid && response.data.key && response.data.name) {
					$scope.fileInsertedInfo.uuid = response.data.uuid;
					$scope.fileInsertedInfo.key = response.data.key;
					$scope.fileInsertedInfo.name = response.data.name;
					console.log("SUCCESS");
				} else {
					console.log("Empty file information, redirect to home page...");
					window.location.href = CONSTANTS.env.url;
				}
				
			}, function (error) {
				console.log("ERROR"+error.data);
		});
	};

	$scope.getFileInfo();

	translateMessage =  function(msg) {
        return eval("TRANSLATION_"+language.toUpperCase()+"."+msg);    
    } 

	$scope.copyElement = function(id) {
		var textToCopy = document.getElementById(id);
		textToCopy.select();
		textToCopy.setSelectionRange(0, 99999); /* For mobile devices */
	  
		document.execCommand("copy");
	  }

	$scope.changeLanguage = function(event) {
	
	$scope.selectedLanguage = event.srcElement.id;

	if($scope.selectedLanguage != language){
		Lang.setlang($scope.selectedLanguage);
		window.location.href = CONSTANTS.env.url+"encrypted";
	}

	};

	$scope.indexTitle = translateMessage("index_title");
	$scope.footerDescription = translateMessage("footer_description");
});


app.controller('decryptCtrl', function($scope, $http, $location, Lang, CONSTANTS, TRANSLATION_ENGLISH, TRANSLATION_CRYPTO) {

	var language = Lang.getlang(CONSTANTS.languages.crypto);

	var language = Lang.getlang(CONSTANTS.languages.crypto);

	$scope.submitForm = function() {
		window.location.href = CONSTANTS.env.url+"searchbyuuid?uuid="+$("#uuid").val();
		// $http({
		// 	method: 'GET',
		// 	url: '/getbyuuid/?uuid='+$("#uuid").val()
		// }).then(
		// 	function (response) {
		// 		$scope.fileInfo.uuid = response.data.uuid;
		// 		$scope.fileInfo.name = response.data.name;
		// 		$scope.fileInfo.size = response.data.size;
		// 		$scope.fileInfo.mime = response.data.mime;
		// 		console.log("SUCCESS");
		// 	}, function (error) {
		// 		console.log("ERROR");
		// });
	};

	$(function() {
		$("#"+language).addClass("button-header-selected");
	});

	translateMessage =  function(msg) {
        return eval("TRANSLATION_"+language.toUpperCase()+"."+msg);    
    } 

	$scope.changeLanguage = function(event) {
	
		$scope.selectedLanguage = event.srcElement.id;

		if($scope.selectedLanguage != language){
			Lang.setlang($scope.selectedLanguage);
			window.location.href = CONSTANTS.env.url+"decryptfile";
		}

	};

	$scope.indexTitle = translateMessage("index_title");
	$scope.footerDescription = translateMessage("footer_description");
});

app.controller('decryptingCtrl', function($scope, $http, $location, Lang, CONSTANTS, TRANSLATION_ENGLISH, TRANSLATION_CRYPTO) {

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
	var language = Lang.getlang(CONSTANTS.languages.crypto);

	$scope.fileInfo = {
		uuid: "",
		name: "",
		size: 0,
		mime: ""
	};

	$scope.decryptedFileObj = {
		uuid: "",
		fileName: "",
		size: 0,
		mime: "",
		payload: ""
	};

	$scope.paramsForDecrypt = {
		uuid: "",
		key: ""
	};


	$scope.getInfos = function() {
		$http({
			method: 'GET',
			url: '/getbyuuid/?uuid='+params.uuid
		}).then(
			function (response) {
				$scope.fileInfo.uuid = response.data.uuid;
				$scope.fileInfo.name = response.data.fileName;
				$scope.fileInfo.size = response.data.size;
				$scope.fileInfo.mime = response.data.mime;
				console.log("SUCCESS");
			}, function (error) {
				console.log("ERROR");
		});
	};

	$scope.decryptAndDownload = function() {
		$scope.paramsForDecrypt.uuid = $scope.fileInfo.uuid;
		$scope.paramsForDecrypt.key = $("#encrkey").val();
		$http({
			method: 'POST',
			url: '/decrypt/',
			headers: {'Content-Type': 'application/json'},
			data: $scope.paramsForDecrypt
		}).then(
			function (response) {
				$scope.decryptedFileObj = response.data;
				console.log("SUCCESS"+response.data);
				$scope.downloadFile();
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

	$scope.getInfos();

	$(function() {
		$("#"+language).addClass("button-header-selected");
	});

	translateMessage =  function(msg) {
        return eval("TRANSLATION_"+language.toUpperCase()+"."+msg);    
    } 

	$scope.changeLanguage = function(event) {
	
		$scope.selectedLanguage = event.srcElement.id;

		if($scope.selectedLanguage != language){
			Lang.setlang($scope.selectedLanguage);
			window.location.href = CONSTANTS.env.url+"decryptfile";
		}

	};

	$scope.indexTitle = translateMessage("index_title");
	$scope.footerDescription = translateMessage("footer_description");
});