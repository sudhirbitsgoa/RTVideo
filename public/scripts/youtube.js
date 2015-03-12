var youtube = angular.module('youtube-embed', []);

youtube.factory('youtubeEmbed', ['$document', '$q', '$rootScope', function($document, $q, $rootScope){

	var y = $q.defer();

	function onScriptLoad(){
		y.resolve(window.yt);
	}

	var scriptTag = $document[0].createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.async = true;
	scriptTag.src = 'https://www.youtube.com/player_api';
	scriptTag.onreadystatechange = function(){
		if(this.readyState == 'complete')
			onScriptLoad();
	}
	scriptTag.onload = onScriptLoad();

	var s = $document[0].getElementsByTagName('body')[0];
	s.appendChild(scriptTag);

	return {
		yt: function(){ return y.promise; }
	};

}]);




youtube.directive('myYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (newVal) {
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
});