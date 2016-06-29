'use strict';

var app = angular.module('email', ['myApp']);

app.component('email', {
    templateUrl: 'templates/email.template.html'
});

app.controller('emailCtrl', function ($scope, $window, sharedData, database) {

    $scope.addManager = []; // used to keep track of text in the manager boxes on the website

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
        $scope.database.getItemsFromDatabase();
        
        // add a manager object to initialize the page
        $scope.addManager.push({}); 
    };
    
    //------------------------------------------------------------------------------------------------------------------
    

    /**
     * Autofills manager information upon entering a valid email address
     */
    $scope.autoFill = function() {
        var email = $scope.addManager[0].email;

        if (email != null) {
            // autofill for admin editing functionality
            if (email === sharedData.adminString) {
                $scope.sharedData.setAdmin();
                $scope.submit($scope.sharedData.globalManager[0]);
            }

            for (var i = 0; i < $scope.database.managers.length; i++) {
                if ($scope.database.managers[i].email.toLowerCase() === email.toLowerCase()) {
                    $scope.addManager[0].name = $scope.database.managers[i].name;
                    $scope.addManager[0].unit = $scope.database.managers[i].unit;
                    $scope.addManager[0].function = $scope.database.managers[i].function;
                    $scope.addManager[0].department = $scope.database.managers[i].department;
                    $scope.addManager[0].phone = $scope.database.managers[i].phone;
                }
            }
        }
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
     * Validates an email address
     * @param email
     * @returns {boolean}
     */
    $scope.validateEmail = function(email) {
        var email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(email);
    };

    /**
     * Clears manager fields
     */
    $scope.clearManager = function() {
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
    $scope.validateManager = function(manager) {
        return !(manager.name.replace(/\s+/g, '') == ""
        || manager.unit.replace(/\s+/g, '') == ""
        || manager.function.replace(/\s+/g, '') == ""
        || manager.department.replace(/\s+/g, '') == ""
        || manager.phone.replace(/\s+/g, '') == ""
        || manager.email.replace(/\s+/g, '') == "");
    };
    
    /**
     * Adds the manager to database
     */
    $scope.submit = function(man) {
        if (!$scope.validateManager(man)) {
            alert("Manager fields not filled out!");
        }
        else {
            var e = man.email;
            var p = man.phone;
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


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});