/**
 * Created by ewu on 6/29/16.
 */
'use strict';

var app = angular.module('manage', ['myApp']);

app.component('manage', {
    templateUrl: 'templates/manage.template.html'
});

app.controller('manageCtrl', function ($scope, $window, sharedData, database) {

    $scope.sharedData = sharedData;

    $scope.manager = sharedData.globalManager[0];
    $scope.addManager = [];
    
    
    /**
     * Clears the manager and returns the user to the
     * login page
     */
    $scope.logOut = function() {
        $scope.sharedData.clearGlobalManager();
        $window.location.href = "#!/login";
    };
    
    /**
     * Goes back to user page without logging changes
     */
    $scope.goBack = function() {
        $window.location.href = "#!/user";
    };

    /**
     * Validates a phone number
     * @param phone
     * @returns {boolean}
     */
    $scope.validatePhone = function(phone) {
        var phone_regex = /^((([0-9]{3}))|([0-9]{3}))[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return phone_regex.test(phone);
    };

    /**
     * Initializes the page
     */
    $scope.pageInit = function() {
        //if user is logged in
        if (!$scope.sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else {
            $scope.addManager.push($scope.manager);
        }
    };

    /**
     * Validates a manager entry
     * @returns {boolean}
     */
    $scope.validateManager = function() {
        return !($scope.manager.name.replace(/\s+/g, '') == ""
        || $scope.manager.unit.replace(/\s+/g, '') == ""
        || $scope.manager.function.replace(/\s+/g, '') == ""
        || $scope.manager.department.replace(/\s+/g, '') == ""
        || $scope.manager.phone.replace(/\s+/g, '') == ""
        || $scope.manager.email.replace(/\s+/g, '') == "");
    };
    
    /**
     * Updates the manager's information
     */
    $scope.updateInfo = function() {
        if (!$scope.validateManager()) {
            alert("Manager fields not filled out!");
        }
        else {
            var p = $scope.manager.phone;
            if ($scope.validatePhone(p)) {
                var manager = $scope.addManager[0];

                // information has been verified
                // store manager data and redirect to correct page
                $scope.sharedData.setGlobalManager(angular.copy(manager));
                $scope.addManager = [];

                // now refresh the list of projects from the database
                var getPromise = database.getItemsFromDatabase();
                // when that is done, load the projects back into the
                //   corresponding list and refresh the display
                getPromise.then(function() {
                    var i = 0;
                    while (i < database.projects.length) {
                        //updating manager in database
                        if (database.projects[i].manager.email === $scope.manager.email) {
                            database.projects[i].manager = $scope.manager;
                            var updatePromise = database.updateProjectFromDatabase(database.projects[i].id, database.projects[i]);
                            
                            updatePromise.then(function() {
                                console.log("updated");
                                i++;
                            });
                        }
                    }

                    $window.location.href = "#!/user";
                });
            }
            else {
                alert("Invalid phone");
            }
        }
    };
    
    //initialize page
    $scope.pageInit();
});