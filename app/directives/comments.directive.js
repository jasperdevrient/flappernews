(function () {
	angular
		.module('FlapperNews')
		.directive('commentList', function () {
			return {
				restrict: 'E',
				scope: {
					'comments': '='
				},
				templateUrl: 'views/commentlist.html',
			}
		});
})();