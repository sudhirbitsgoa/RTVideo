angular.module('ngSampleApp')
  .controller('UsersCtrl', function ($scope, $resource, $cookies) {

    $scope.api_key = null;
    $scope.error = false;
    $scope.hidden = true;

    /* REST API actions */
    var users = $resource(
      '/users',
      {},
      {
        add: {
          method: 'POST'
        }
      }
    );

    $scope.newUser = function() {
      users.add($scope.newUserForm, function (res) {
        $cookies.api_key = res.api_key;
        $cookies.username = res.username;
        $scope.api_key = res.api_key;
        $scope.api_key = res.api_key;
        $scope.hidden = false;
      },
      function (err) {
        if (err.status == 409) {
          $scope.error = true;
        }
      });
    };
  });
