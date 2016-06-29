'use strict';

var app = angular.module('myApp', [
    'ngRoute', 
    'ui.date',
    'isteven-multi-select',
    'display',          //admin display projects page
    'email',            //log in screen
    'entry',            //entering projects
    'user',             //user landing page after logging in
    'preview',          //preview project reports
    'previous',         //previous projects
    'manage'            //editing manager info
]);

app.config([
    '$locationProvider',
    '$routeProvider',
    '$httpProvider',
    function config($locationProvider, $routeProvider, $httpProvider) {
        // cors compatibility
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        

        // define the routes for the application
        $locationProvider.hashPrefix('!');

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
        when('/manage', {
            template: '<manage></manage>'
        }).
        otherwise('/login');
    }
]);
