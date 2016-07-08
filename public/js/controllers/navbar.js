'use strict';

var app = angular.module('navbar', ['myApp']);

app.controller('navbarCtrl', function ($scope, sharedData) {
    $scope.sharedData = sharedData;
});