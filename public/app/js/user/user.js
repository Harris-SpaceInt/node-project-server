'use strict';

var app = angular.module('user', ['myApp']);

app.component('user', {
    templateUrl: '../views/user.template.html'
});

app.controller('userCtrl', function ($scope, $window, sharedData, database) {

    //------------------------------------------------------------------------------------------------------------------
    // link database and sharedData to scope variables 

    $scope.database = database;

    $scope.sharedData = sharedData; 

    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function() {
        // check if user is already logged in
        if (!$scope.sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
    };

    //------------------------------------------------------------------------------------------------------------------


    /**
     * Clears the manager and returns the user to the
     * login page
     */
    $scope.logOut = function() {
        $scope.sharedData.clearGlobalManager();
        $window.location.href = "#!/login";
    };

    /**
     * Takes the user to the entry page
     */
    $scope.addNewProject = function() {
        $window.location.href = "#!/entry";
    };

    /**
     * Takes the user to the view previous page
     */
    $scope.viewPreviousProjects = function() {
        $window.location.href = "#!/previous";
    };

    /**
     * Checks if the user has any previously submitted
     * projects
     * @returns {boolean} true if user has submitted
     * at least one project
     */
    $scope.hasPrevious = function() {
        if ($scope.sharedData.globalManager[0] != null) {
            // admin editing functionality
            if ($scope.sharedData.checkAdmin()) {
                return true;
            }

            for (var i = 0; i < $scope.database.projects.length; i++) {
                var manager = $scope.database.getManagerById($scope.database.projects[i].manager.id);
                if (manager.email.toLowerCase() === $scope.sharedData.globalManager[0].email.toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
    
});