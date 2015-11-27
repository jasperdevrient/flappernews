(function() {
	angular
	.module('FlapperNews')
	.directive('comment', function(RecursionHelper) {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				'comment': '=',
				'increaseUpvotes': '&',
				'addComment': '&'
			},
			templateUrl: 'views/comment.html',
			compile: function(element) {
            	return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
				scope.visible = false;
				scope.body ='';
				scope.liked = false;
				scope.showCommentDialog = function() {
					scope.visible = true;
				};
				scope.addCommentFix = function() {
					scope.visible = false;
					var func = scope.addComment;
					
					while (func.length !== 2)
						func = func();
					func(scope.comment,scope.body);
					scope.body = '';
					
				
				};
				
				scope.like = function() {
					var func = scope.increaseUpvotes;
					while (func.length !== 2)
						func = func();
						
					func(scope.comment, function() {
						scope.liked = true;
					});
				}
				
				scope.hide = function() {
					scope.visible = false;
				}
            });
        }
		}
	});
})();