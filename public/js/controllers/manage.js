'use strict';

var app = angular.module('manage', ['myApp']);

app.controller('manageCtrl', function ($scope, $window, sharedData, database, dropdown) {
    
    //linking sharedData to scope
    $scope.sharedData = sharedData;

    $scope.manager = sharedData.globalManager[0];
    $scope.addManager = []; //fields for manager information to be edited
    $scope.dropdown = dropdown;
    
    /**
     * Validates a phone number
     * @param phone
     * @returns {boolean} true if the phone number is of valid formatting
     */
    $scope.validatePhone = function (phone) {
        var phone_regex = /^((([0-9]{3}))|([0-9]{3}))[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return phone_regex.test(phone);
    };

    /**
     * Initializes the page
     */
    $scope.pageInit = function () {
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
     * @returns {boolean} true if the updated manager fields are valid
     */
    $scope.validateManager = function () {
        return !($scope.manager.name.replace(/\s+/g, '') == ""
        || $scope.manager.unit.replace(/\s+/g, '') == ""
        //|| $scope.manager.function.replace(/\s+/g, '') == ""
        || $scope.manager.department.replace(/\s+/g, '') == ""
        || $scope.manager.phone.replace(/\s+/g, '') == ""
        || $scope.manager.email.replace(/\s+/g, '') == "");
    };

    /**
     * Updates the manager's information in the database
     */
    $scope.updateInfo = function () {
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

                var getPromise = database.getManagerByEmail($scope.manager.email);

                getPromise.then(function (data) {
                    //data found
                    if (data !== null) {
                        var updatePromise = database.updateManagerInDatabase(data._id, manager);
                        updatePromise.then(function () {
                            $window.location.href = "#!/previous";
                        });
                    }
                    else {
                        console.log("Error: Manager not in database");
                    }
                });
            }
            else {
                alert("Invalid phone");
            }
        }
    };

    /**
     * Returns to previous page
     */
    $scope.goBackToPrevious = function () {
        $window.location.href = "#!/previous";
    };

    //initialize page
    $scope.pageInit();
});