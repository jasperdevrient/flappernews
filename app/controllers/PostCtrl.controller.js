(function () {
	angular
		.module('FlapperNews')
		.controller('PostsCtrl', [
			'$scope',
			'posts',
			'post',
			'auth',
			function ($scope, posts, post, auth) {

				$scope.post = post;
				$scope.isLoggedIn = auth.isLoggedIn;
				$scope.addComment = function () {
					if ($scope.body === '')
						return;

					posts.addComment(post._id, {
						body: $scope.body,
						author: 'user',
					}).success(function (comment) {
						$scope.post.comments.push(comment);
					});
					$scope.body = '';

				};

				$scope.addCommentToComment = function (comment, body) {
					
					if (body === null && body === '')
						return;
						
					posts.addCommentToComment(post._id, comment._id, {
						body: body
					}).success(function (newC) {
						comment.comments.push(newC);
					});
				};

				$scope.incrementUpvotes = function (comment) {
					posts.upvoteComment(post, comment);
				};
			}
		]);
})();