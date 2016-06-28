'use strict';

var app = angular.module('myApp');

app.factory('database', function($http, $q) {
    var factoryData = {};


    factoryData.reports = [];
    factoryData.projects = [];
    factoryData.managers = [];
    factoryData.results = [];


    // set the url of the database server
    var dataUrl = "localhost:8080";

    
    //------------------------------------------------------------------------------------------------------------------
    // functions to retrieve data from the database
    // these functions populate the fields above
    
    /**
     * helper function for getItemsFromDatabase. gets report information from
     * the database from the managers url and gives it to reports
     */
    factoryData.getReportsFromDatabase = function() {
        console.log("Starting GET for reports...");

        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/reports'})
            .success(function (data, status) {
                console.log("GET was successful for reports");
                factoryData.reports = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                console.log("Error retrieving reports");
                console.log("status: " + status);
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * helper function for getItemsFromDatabase. gets project information from
     * the database from the projects url and gives it to projects
     */
    factoryData.getProjectsFromDatabase = function() {
        console.log("Starting GET for projects...");

        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/projects'})
            .success(function (data, status) {
                console.log("GET was successful for projects");
                factoryData.projects = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                console.log("Error retrieving projects");
                console.log("status: " + status);
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * helper function for getItemsFromDatabase. gets manager information from
     * the database from the managers url and gives it to managers
     */
    factoryData.getManagersFromDatabase = function() {
        console.log("Starting GET for managers...");

        var deferred = $q.defer();

        $http({method : 'GET', url : dataUrl + '/managers'})
            .success(function(data, status) {
                console.log("GET was successful for managers");
                factoryData.managers = data;

                deferred.resolve(data);
            })
            .error(function(data, status) {
                console.log("Error retrieving managers");
                console.log("status: " + status);
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * helper function for getItemsFromDatabase. gets result information from
     * the database from the results url and gives it to results
     */
    factoryData.getResultsFromDatabase = function() {
        console.log("Starting GET for results...");

        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/results'})
            .success(function (data, status) {
                console.log("GET was successful for results");
                factoryData.results = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                console.log("Error retrieving results");
                console.log("status: " + status);
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
};

    /**
     * Adds manager and result data to projects
     * @returns {*}
     */
    factoryData.compileProjects = function() {
        // add a checked field and date field to all project objects
        // the checked field is linked to a checkbox next to each project for selection
        // the date field is displayed on the project display page and used for sorting
        for (var i = 0; i < factoryData.projects.length; i++) {
            factoryData.projects[i].checked = false;
            factoryData.projects[i].date = new Date(factoryData.projects[i].year, factoryData.projects[i].month - 1, factoryData.projects[i].day);
        }

        // add managers and results to the project objects
        for (var i = 0; i < factoryData.projects.length; i++) {
            factoryData.projects[i].manager = factoryData.getManagerById(factoryData.projects[i].manager.id);

            for (var j = 0; j < factoryData.projects[i].result.length; j++) {
                factoryData.projects[i].result[j] = factoryData.getResultById(factoryData.projects[i].result[j].id);
            }

        }
    };

    /**
     * Adds project data to reports
     * @returns {*}
     */
    factoryData.compileReports = function() {
        // add projects to the report objects
        for (var i = 0; i < factoryData.reports.length; i++) {
            for (var j = 0; j < factoryData.reports[i].project.length; j++) {
                factoryData.reports[i].project[j] = factoryData.getProjectById(factoryData.reports[i].project[j].id);
            }
        }
    };

    factoryData.compileItems = function() {
        this.compileProjects();
        this.compileReports();
    };

    /**
     * fills reports, projects, managers, and results with information
     * from the database 
     */
    factoryData.getItemsFromDatabase = function() {
        var deferred = $q.defer();
        
        $q.all([
            this.getManagersFromDatabase(),
            this.getResultsFromDatabase(),
            this.getProjectsFromDatabase(),
            this.getReportsFromDatabase()
        ]).then(function(success) {
            // data retrieved
            // do post processing
            factoryData.compileItems();
            deferred.resolve();
        });
        
        return deferred.promise;
    };


    //------------------------------------------------------------------------------------------------------------------
    // functions to add, update, and delete from the database

    /**
     * Posts an item to the database from the items array
     * @type {*[]}
     */
    factoryData.addProjectToDatabase = function(project) {
        console.log("Starting POST...");

        $http({method : 'POST', url : dataUrl + '/projects', data : project})
            .success(function(data, status) {
                console.log("POST was successful");

                // update on success
                factoryData.getItemsFromDatabase();
            })
            .error(function(data, status) {
                console.log("Error sending data");
                console.log("status: " + status);
                console.log(project)
                alert("Error submitting project data");
            });
    };
    
    /**
     * Updates an item already in the database
     * @type {*[]}
     */
    factoryData.updateProjectFromDatabase = function(id, project) {
        console.log("Starting function...");

        $http({method : 'PUT', url : dataUrl + '/projects/' + id, data : project})
            .success(function(data, status) {
                console.log("PUT was successful");

                // update on success
                factoryData.getItemsFromDatabase();
            })
            .error(function(data, status) {
                console.log("Error sending data");
                console.log("status: " + status);
                alert("Error submitting project data");
            });
    };

    /**
     * Updates an item already in the database
     * @type {*[]}
     */
    factoryData.deleteProjectFromDatabase = function(id) {
        var deferred = $q.defer();
        
        console.log("Starting function...");

        $http({method : 'DELETE', url : dataUrl + '/projects/' + id})
            .success(function(data, status) {
                console.log("DELETE was successful");

                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve(data);
            })
            .error(function(data, status) {
                console.log("Error deleting data");
                console.log("status: " + status);
                alert("Error deleting project data");
                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Posts an item to the database from the items array
     * @type {*[]}
     */
    factoryData.addReportToDatabase = function(report) {
        console.log("Starting POST...");

        $http({method : 'POST', url : dataUrl + '/reports', data : report})
            .success(function(data, status) {
                console.log("POST was successful");

                // update on success
                factoryData.getItemsFromDatabase();
            })
            .error(function(data, status) {
                console.log("Error sending data");
                console.log("status: " + status);
                alert("Error submitting report data");
            });
    };


    //--------------------------------------------------------------------------
    // some functions to help link projects to managers and results and reports
    // to projects

    /**
     * Retrieves a project given an ID number
     * @param id
     * @returns {object}
     */
    factoryData.getProjectById = function(id) {
        for (var i = 0; i < factoryData.projects.length; i++) {
            if (id === factoryData.projects[i].id) {
                return factoryData.projects[i];
            }
        }
        return {};
    };

    /**
     * Retrieves a manager (their email) given an ID number
     * @param id
     * @returns {object}
     */
    factoryData.getManagerById = function(id) {
        for (var i = 0; i < factoryData.managers.length; i++) {
            if (id === factoryData.managers[i].id) {
                return factoryData.managers[i];
            }
        }
        return {};
    };

    /**
     * Retrieves a result given an ID
     * @param id
     * @returns {object}
     */
    factoryData.getResultById = function(id) {
        for (var i = 0; i < factoryData.results.length; i++) {
            if (id === factoryData.results[i].id) {
                return factoryData.results[i];
            }
        }
        return {};
    };

    
    //------------------------------------------------------------------------------------------------------------------
    

    return factoryData;
});