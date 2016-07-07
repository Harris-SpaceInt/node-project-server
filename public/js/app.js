'use strict';

var app = angular.module('myApp', [
    'ngRoute', 
    'ui.date',
    'isteven-multi-select',
    'display',          //admin display projects page
    'email',            //log in screen
    'entry',            //entering projects
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
            templateUrl: 'templates/email.template.html',
            controller: 'emailCtrl'
        }).
        when('/user', {
            templateUrl: 'templates/user.template.html',
            controller: 'userCtrl'
        }).
        when('/display', {
            templateUrl: 'templates/display.template.html',
            controller: 'displayCtrl'
        }).
        when('/entry', {
            templateUrl: 'templates/entry.template.html',
            controller: 'entryCtrl'
        }).
        when('/previous', {
            templateUrl: 'templates/previous.template.html',
            controller: 'previousCtrl'
        }).
        when('/preview', {
            templateUrl: 'templates/preview.template.html',
            controller: 'previewCtrl'
        }).
        when('/manage', {
            templateUrl: 'templates/manage.template.html',
            controller: 'manageCtrl'
        }).
        otherwise('/login');
    }
]);
