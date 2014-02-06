angular.module('ngSampleApp')
  .controller('IndexCtrl', function ($scope, $resource, $location, $cookies) {

    var api_key = $cookies.api_key || '';

    $scope.newVideoForm = {};
    $scope.file = null;
    $scope.progress = 0;

    /* REST API actions */
    var videos = $resource(
      '/api/videos/:id',
      {
        id: '@id'
      },
      {
        get: {
          method: 'GET',
          isArray: true
        },
        update: {
          method: 'PUT',
          params: {
            apikey: api_key
          }
        },
        remove: {
          method: 'DELETE',
          params: {
            apikey: api_key
          },
          isArray: true
        }
      }
    );

    $scope.$on('fileSelected', function (e, args) {
      $scope.$apply(function() {
        $scope.file = args.file;
      });
    });

    /* Get all videos */
    $scope.videos = videos.get();

    /* Upload video */
    $scope.newVideo = function() {
      var form, xhr;

      form = new FormData();

      form.append('title', $scope.newVideoForm.title);
      form.append('description', $scope.newVideoForm.description);
      form.append('file', $scope.file);

      xhr = new XMLHttpRequest();

      xhr.open('POST', '/api/videos?apikey=' + api_key);
      xhr.responseType = 'json';

      xhr.addEventListener('load', function() {
        $scope.$apply(function() {
          if (xhr.status == 200) {
            $scope.endUpload();
            $scope.videos = xhr.response;
            $scope.newVideoForm = {};
          }
          if (xhr.status == 401) {
            $location.path('/signin');
          }
        });
      }, false);

      xhr.upload.addEventListener('progress', function (e) {
        $scope.$apply(function() {
          $scope.progress = e.loaded / e.total * 100;
        });
      }, false);

      xhr.send(form);
    };

    /* Remove video */
    $scope.removeVideo = function (id) {
      videos.remove({id: id},
        function (videos) {
          $scope.videos = videos;
        },
        function (err) {
          if (err.status == 401) {
            $location.path('/signin');
          }
        });
    };
  })
  .directive('ngFileUpload', function() {
    return {
      scope: true,
      link: function ($scope, $el, $attrs) {
        $el.bind('change', function (e) {
          $scope.$emit('fileSelected', {file: e.target.files[0]});
        });
      }
    };
  })
  .directive('ngProgress', function ($timeout) {
    return {
      link: function ($scope, $el, $attrs) {
        $scope.hidden = false;
        $scope.$watch('progress', function() {
          $el[0].style.width = $scope.progress + '%';
        });
        $scope.startUpload = function() {
          $scope.hidden = true;
          $timeout(function() {
            $scope.newVideo();
          }, 200);
        };
        $scope.endUpload = function() {
          $scope.hidden = false;
          $timeout(function() {
            $scope.progress = 0;
          }, 200);
        };
      }
    };
  });
