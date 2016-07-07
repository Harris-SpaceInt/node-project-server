'use strict';

var app = angular.module('email', ['myApp']);

app.controller('emailCtrl', function ($scope, $window, sharedData, database) {

    $scope.addManager = [{
        email: "",
        name: "",
        unit: "",
        function: "",
        department: "",
        phone: ""
    }]; // used to keep track of text in the manager boxes on the website

    //------------------------------------------------------------------------------------------------------------------
    // link database and sharedData to scope variables 

    $scope.database = database;
    $scope.sharedData = sharedData;
    $scope.managerExists = false; //if manager exists in the database
    $scope.createAccount = false; //variable for toggling fields when creating an account

    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if ($scope.sharedData.loggedIn()) {
            // user is logged in
            // redirect to correct page
            if ($scope.sharedData.checkAdmin()) {
                // user is admin
                $window.location.href = "#!/display";
            }
            else {
                // regular user
                $window.location.href = "#!/user";
            }
        }

        // load all project data from the database
        $scope.database.getManagersFromDatabase();
    };

    //------------------------------------------------------------------------------------------------------------------

    /**
     * Sets account creation settings to true
     */
    $scope.create = function () {
        $scope.createAccount = true;
    };

    /**
     * Cancels account creation
     */
    $scope.cancel = function () {
        $scope.clearManager();
        $scope.createAccount = false;
    };

    /**
     * Autofills manager information upon entering a valid email address
     */
    $scope.autoFill = function () {
        var email = $scope.addManager[0].email;

        if (email != null) {
            // autofill for admin editing functionality
            if (email === sharedData.adminString) {
                $scope.sharedData.setAdmin();
                $scope.submit($scope.sharedData.globalManager[0]);
            }

            var managerIndex = $scope.findManager(email);
            $scope.managerExists = !(managerIndex === -1);

            if ($scope.managerExists) {
                $scope.addManager[0].name = $scope.database.managers[managerIndex].name;
                $scope.addManager[0].unit = $scope.database.managers[managerIndex].unit;
                $scope.addManager[0].function = $scope.database.managers[managerIndex].function;
                $scope.addManager[0].department = $scope.database.managers[managerIndex].department;
                $scope.addManager[0].phone = $scope.database.managers[managerIndex].phone;
            }
            else {
                $scope.addManager[0].name = "";
                $scope.addManager[0].unit = "";
                $scope.addManager[0].function = "";
                $scope.addManager[0].department = "";
                $scope.addManager[0].phone = "";
            }
        }
    };

    /**
     * Returns index of a manager in the database if an email match is found
     * @param email
     * @returns {number}
     */
    $scope.findManager = function (email) {
        for (var i = 0; i < $scope.database.managers.length; i++) {
            if ($scope.database.managers[i].email.toLowerCase() === email.toLowerCase()) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Validates a phone number
     * @param phone
     * @returns {boolean}
     */
    $scope.validatePhone = function (phone) {
        var phone_regex = /^((([0-9]{3}))|([0-9]{3}))[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return phone_regex.test(phone);
    };

    /**
     * Validates an email address
     * @param email
     * @returns {boolean}
     */
    $scope.validateEmail = function (email) {
        var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(email);
    };

    /**
     * Clears manager fields
     */
    $scope.clearManager = function () {
        $scope.addManager[0].email = "";
        $scope.addManager[0].name = "";
        $scope.addManager[0].unit = "";
        $scope.addManager[0].function = "";
        $scope.addManager[0].department = "";
        $scope.addManager[0].phone = "";
    };

    /**
     * Validates a manager entry
     * @returns {boolean}
     */
    $scope.validateManager = function () {
        if ($scope.addManager[0] === undefined) {
            return false;
        }
        //admin access
        else if ($scope.addManager[0].email === "view admin") {
            return true;
        }
        else {
            //checks for undefined fields
            if ($scope.addManager[0].name === undefined
            || $scope.addManager[0].unit === undefined
                || $scope.addManager[0].function === undefined
                || $scope.addManager[0].department === undefined
                || $scope.addManager[0].phone === undefined) {
                return false;
            }
            //if not undefined, checks for empty fields
            return !($scope.addManager[0].name.replace(/\s+/g, '') == ""
            || $scope.addManager[0].unit.replace(/\s+/g, '') == ""
            || $scope.addManager[0].function.replace(/\s+/g, '') == ""
            || $scope.addManager[0].department.replace(/\s+/g, '') == ""
            || $scope.addManager[0].phone.replace(/\s+/g, '') == "");
        }
    };

    /**
     * Checks if the current manager is in the database and redirects accordingly
     */
    $scope.redirect = function () {
        var promise = database.getManagerByEmail(sharedData.globalManager[0].email);

        promise.then(function (data) {
            $scope.managerExists = (data !== null);
            if ($scope.managerExists) {
                $window.location.href = "#!/previous";
            }
            else {
                $window.location.href = "#!/entry";
            }
        });
    };

    /**
     * Logs user in
     */
    $scope.submit = function () {
        if (!$scope.validateManager()) {
            alert("Manager fields not filled out!");
        }
        else {
            if ($scope.sharedData.checkAdmin()) {
                // user is admin
                $window.location.href = "#!/display";
            }
            else {
                var e = $scope.addManager[0].email;
                var p = $scope.addManager[0].phone;
                if ($scope.validatePhone(p) && $scope.validateEmail(e)) {
                    $scope.sharedData.setGlobalManager(angular.copy($scope.addManager[0]));
                    $scope.addManager.splice(0, 1);

                    //runs asynchronously
                    $scope.redirect();
                }
                else {
                    alert("Invalid phone and/or email");
                }
            }
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});