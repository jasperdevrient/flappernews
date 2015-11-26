(function () {

  angular
    .module('FlapperNews')
    .controller('MainCtrl', [
      '$scope',
      'posts',
      'auth',
      function ($scope, posts, auth) {

        $scope.posts = posts.posts;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addPost = function () {
          if (!$scope.title || $scope.title === '')
            return;
          posts.create({
            title: $scope.title,
            link: $scope.link,
            description: $scope.description
          });
          $scope.title = '';
          $scope.link = '';
          $scope.description = '';
        };

        $scope.incrementUpvotes = function (post) {
          posts.upvote(post);
        };
      }
    ]);

})();