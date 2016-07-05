'use strict';

var app = angular.module('myApp');

app.factory('database', function($http, $q) {
    var factoryData = {};


    factoryData.reports = [];
    factoryData.projects = [];
    factoryData.managers = [];
    factoryData.results = [];
    
    factoryData.currentReport = {};


    // set the url of the database server
    var dataUrl = "http://localhost:8080/api";

    
    //------------------------------------------------------------------------------------------------------------------
    // functions to retrieve data from the database
    // these functions populate the fields above
    
    /**
     * gets report information from the database from the reports 
     * url and gives it to reports
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
     * gets the report with a specified index from the database
     * and sets it as the currentReport
     */
    factoryData.getReportFromDatabase = function(id) {
        console.log("Starting GET for report...");

        var deferred = $q.defer();

        $http({method: 'GET', url: dataUrl + '/reports/' + id})
            .success(function (data, status) {
                console.log("GET was successful for report");
                factoryData.currentReport = data;

                deferred.resolve(data);
            })
            .error(function (data, status) {
                console.log("Error retrieving report");
                console.log("status: " + status);
                if (confirm("Error retrieving report data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });

        return deferred.promise;
    };

    /**
     * gets project information from the database from the projects 
     * url and gives it to projects
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
     * gets manager information from the database from the managers 
     * url and gives it to managers
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
     * Retrieves a manager given an email
     * @param email
     */
    factoryData.getManagerByEmail = function(email) {
        var deferred = $q.defer();

        $http({method: "GET", url : dataUrl + "/managers/email/" + email})
            .success(function(data, status) {
                console.log("Manager get success");
                deferred.resolve(data);
            })
            .error(function(data, status) {
                console.log("Error retrieving manager");
                console.log("status: " + status);
                if (confirm("Error retrieving project data. Try again?")) {
                    $route.reload();
                }

                deferred.reject();
            });
        
        return deferred.promise;
    };
    
    /**
     * fills reports, projects, managers, and results with information
     * from the database 
     */
    factoryData.getItemsFromDatabase = function() {
        var deferred = $q.defer();
        
        $q.all([
            this.getManagersFromDatabase(),
            this.getProjectsFromDatabase(),
            this.getReportsFromDatabase()
        ]).then(function(success) {
            // data retrieved
            // do post processing
            console.log('All data retrieved');
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
                alert("Error submitting project data");
            });
    };
    
    /**
     * Updates an item already in the database
     * @type {*[]}
     */
    factoryData.updateProjectFromDatabase = function(id, project) {
        console.log("Starting function...");

        $http({method : 'PUT', url : dataUrl + '/projects/id/' + id, data : project})
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
     * Updates a manager already in the database
     * @type {*[]}
     */
    factoryData.updateManagerInDatabase = function(id, manager) {
        console.log("Starting function...");

        var deferred = $q.defer();
        
        $http({method : 'PUT', url : dataUrl + '/managers/id/' + id, data : manager})
            .success(function(data, status) {
                console.log("PUT was successful");

                // update on success
                factoryData.getItemsFromDatabase();
                deferred.resolve(data);
            })
            .error(function(data, status) {
                console.log("Error sending data");
                console.log("status: " + status);
                alert("Error submitting manager data");
                deferred.reject();
            });
        
        return deferred.promise;
    };

    /**
     * Updates an item already in the database
     * @type {*[]}
     */
    factoryData.deleteProjectFromDatabase = function(id) {
        var deferred = $q.defer();
        
        console.log("Starting function...");

        $http({method : 'DELETE', url : dataUrl + '/projects/id/' + id})
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


    //------------------------------------------------------------------------------------------------------------------
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