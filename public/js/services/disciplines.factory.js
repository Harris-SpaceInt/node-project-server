'use strict';

var app = angular.module('myApp');

app.factory('disciplines', function() {
    var data = {};

    //array of disciplines
    data.selectable = [{
        label: "Software",
        ticked: false
    }, {
        label: "Systems",
        ticked: false
    }, {
        label: "Electrical",
        ticked: false
    }, {
        label: "Mechanical",
        ticked: false
    }, {
        label: "Production",
        ticked: false
    }, {
        label: "Integration and Test",
        ticked: false
    }, {
        label: "Corporate",
        ticked: false
    }, {
        label: "Program Management",
        ticked: false
    }];
    
    return data;
});