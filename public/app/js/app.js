'use strict';

var app = angular.module('myApp', ['ngRoute', 'ui.date', 'display', 'email', 'entry', 'user', 'preview', 'previous', 'isteven-multi-select']);

app.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        // need to finish this
        $routeProvider.
        when('/login', {
            template: '<email></email>'
        }).
        when('/user', {
            template: '<user></user>'
        }).
        when('/display', {
            template: '<display></display>'
        }).
        when('/entry', {
            template: '<entry></entry>'
        }).
        when('/previous', {
            template: '<previous></previous>'
        }).
        when('/preview', {
            template: '<preview></preview>'
        }).
        otherwise('/login');
    }
]);
