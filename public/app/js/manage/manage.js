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
            var e = $scope.manager.email;
            var p = $scope.manager.phone;
            if ($scope.validatePhone(p) && $scope.validateEmail(e)) {
                var index = $scope.addManager.indexOf(man);
                $scope.addManager.splice(index, 1);


                // information has been verified
                // store manager data and redirect to correct page
                $scope.sharedData.setGlobalManager(angular.copy(man));

                // handle admin and regular user cases for submit
                if ($scope.sharedData.checkAdmin()) {
                    // user is admin
                    $window.location.href = "#!/display";
                }
                else {
                    // regular user
                    $window.location.href = "#!/user"
                }
            }
            else {
                alert("Invalid phone and/or email");
            }
        }
    };
    
    //initialize page
    $scope.pageInit();
    console.log("initialized");
});