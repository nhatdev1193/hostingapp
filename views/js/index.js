angular.module('streaming', ['ngFileUpload'])
  .controller('mainController', function($scope, $http, Upload) {
     $scope.uploadBody = {
      type: "ipa",
      title: "",
      bundleID: "",
      bundleVersion: "",
     }
     
     const uploadFunction = function (file) {
        const extFile = file.name.split('.')[1];
        if (extFile === $scope.uploadBody.type) {
          $scope.percent = 0;
          Upload.upload({
            url: '/api/v1/upload',
            data: {bundleID: $scope.uploadBody.bundleID, bundleVersion: $scope.uploadBody.bundleVersion, 
                   title: $scope.uploadBody.title, file: file},
            headers: JSON.parse(localStorage.getItem('user')),
          }).then(function(resp) {
            $scope.uploadBody = {
              type: "ipa",
              title: "",
              bundleID: "",
              bundleVersion: "",
            }
            file = '';
            $scope.link = resp.data.link;
          }, function(resp) {
            console.log('Error status: ' + resp.status);
          }, function(evt) {
            let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
        } else {
          return window.alert(`Please upload file ${$scope.uploadBody.type}`)
        }
     };

     $scope.upload = function(file) {
      if ($scope.uploadBody.type === "ios") {
        if ($scope.uploadBody.title === "" && $scope.uploadBody.bundleID === "" && $scope.uploadBody.bundleVersion === "") {
          return window.alert('Please input field if your app is ios')
        }
        uploadFunction(file);
      } else {
        uploadFunction(file);
      }
    };
  });
