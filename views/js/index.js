angular.module('streaming', ['ngFileUpload'])
  .controller('mainController', function ($scope, $http, Upload) {
    $http.get('/api/v1/list').then(function (res) {
      $scope.list = res.data
    });

    $scope.sendMail = function (item) {
      let html =
        '<table>' +
        '<thead><tr><th>Date</th><th>Title</th><th>File</th><th>link</th></tr></thead>' +
        '<tbody><tr><td>' + item.date + '</td><td>' + item.title + '</td><td>' + item.appURL + '</td><td>' + item.link + '</td></tr></tbody>' +
        '</table>'
      $http.post('/api/v1/send-mail', {
        html: html
      }).then((res) => {
        alert('ok');
      }).catch((err) => {
        alert('error');
      })
    };

    $scope.uploadBody = {
      type: "ipa",
      title: "",
      bundleID: "",
      bundleVersion: "",
    }

    const uploadFunction = function (file) {
      let extFile = file.name.split('.');
      extFile = extFile[extFile.length - 1];
      console.log(extFile);
      if (extFile === $scope.uploadBody.type) {
        $scope.percent = 0;
        Upload.upload({
          url: '/api/v1/upload',
          data: {
            bundleID: $scope.uploadBody.bundleID, bundleVersion: $scope.uploadBody.bundleVersion,
            title: $scope.uploadBody.title, file: file
          },
          headers: JSON.parse(localStorage.getItem('user')),
        }).then(function (resp) {
          $scope.uploadBody = {
            type: "ipa",
            title: "",
            bundleID: "",
            bundleVersion: "",
          }
          file = '';
          $scope.link = resp.data.link;
        }, function (resp) {
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          let progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      } else {
        return window.alert(`Please upload file ${$scope.uploadBody.type}`)
      }
    };

    $scope.upload = function (file) {
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
