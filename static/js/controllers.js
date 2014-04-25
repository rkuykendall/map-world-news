'use strict';

/* Controllers */

var countriesNewsApp = angular.module('countriesNewsApp', []);

countriesNewsApp.controller('NewsListCtrl', function($scope, $http) {
/* Old code when manually added JSON
  $scope.stories = [
    {'title': 'Escape from New York',
     'summary': 'Fast just got faster with Nexus S.',
     'age': 1},
    {'title': 'Snake Plissken is saving',
     'summary': 'The Next, Next Generation tablet.',
     'age': 2}
  ];
*/


  $http.get('json/us_articles.json').success(function(data) {
    $scope.stories = data;
  });

  // $scope.orderProp = 'age';
});