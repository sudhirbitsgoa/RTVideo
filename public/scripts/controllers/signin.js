angular.module('ngSampleApp')
  .controller('SigninCtrl', function ($scope, $resource, $location, $cookies) {

    $scope.error = false;

    /* REST API actions */
    var user = $resource(
      '/signin',
      {},
      {
        signin: {
          method: 'POST'
        }
      }
    );

    $scope.signin = function() {
      user.signin($scope.signinForm, function (res) {
        $cookies.api_key = res.api_key;
        $location.path('/');
      },
      function (err) {
        if (err.status == 401 || err.status == 404) {
          $scope.error = true;
        }
      });
    };
  });
