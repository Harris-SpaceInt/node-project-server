'use strict';

var app = angular.module('myApp');

/**
 * Factory module to hold and transfer data between views
 */
app.factory('sharedData', function() {
    var data = {};

    // type this in the email box to go to the admin page
    data.adminString = 'view admin';
    
    // project to transfer between views
    data.project = null;

    // global manager for application
    // essentially who is logged in
    data.globalManager = [];

    // list of projects to transfer between views before submitting to database
    data.projectList = [];
    

    data.fromDatabase = false; //boolean to check whether or not an edited project is coming from the database
    
    /**
     * Checks if there is a global manager
     * @returns {boolean}
     */
    data.loggedIn = function() {
        return this.globalManager[0] !== undefined;
    };
    
    /**
     * Checks if the global manager is an admin
     * @returns {boolean}
     */
    data.checkAdmin = function () {
        // check if there is a global manager
        if (!this.loggedIn()) {
            return false;
        }
        // user is logged in, so check the fields
        return this.globalManager[0].name === "admin"
                && this.globalManager[0].unit === "admin"
                && this.globalManager[0].function === "admin"
                && this.globalManager[0].department === "admin"
                && this.globalManager[0].phone === "1234567890"
                && this.globalManager[0].email === "admin@admin.admin";
    };

    /**
     * Set the global manager to the admin
     */
    data.setAdmin = function () {
        var admin = {};
        admin.name = "admin";
        admin.unit = "admin";
        admin.function = "admin";
        admin.department = "admin";
        admin.phone = "1234567890";
        admin.email = "admin@admin.admin";

        if (this.loggedIn()) {
            console.log("Switching from regular user to admin...");
            this.clearGlobalManager();
        }
        
        this.setGlobalManager(admin);
    };
    
    /**
     * Sets a global manager (if there is not 
     * already one)
     * @param {object} manager
     */
    data.setGlobalManager = function (manager) {
        if (this.globalManager.length == 0) {
            this.globalManager.push(manager);
        }
        else {
            console.log("Error trying to set global manager. " +
                "Global manager already set.");
        }
    };
    
    /**
     * Clears the global manager (logs out)
     */
    data.clearGlobalManager = function () {
        this.globalManager = [];
    };

    /**
     * Adds a project to projectList and the end
     * of the array
     * @param {object} projectToAdd
     */
    data.pushToProjectList = function (projectToAdd) {
        this.projectList.push(projectToAdd);
    };

    /**
     * Deletes a project from projectList at index
     * @param {number} index
     */
    data.deleteFromProjectList = function (index) {
        if (typeof this.projectList[index] === 'undefined') {
            console.log('Error trying to remove from index in projectList. ' +
                'Nothing is stored at index ' + index + '.');
        }
        else {
            this.projectList.splice(index, 1);
        }
    };

    /**
     * Clears the list of projects
     */
    data.clearProjectList = function () {
        this.projectList = [];
    };

    /**
     * To string for an array
     * @param array
     * @returns {string}
     */
    data.getArrayString = function (array) {
        var string = "";
        for (var i = 0; i < array.length - 1; i++) {
            string += (array[i] + ", ");
        }
        return (string + array[array.length - 1]);
    };


    return data;
});
