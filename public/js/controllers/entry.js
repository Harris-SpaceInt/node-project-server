'use strict';

var app = angular.module('entry', ['myApp']);

app.controller('entryCtrl', function ($scope, $window, sharedData, database, disciplines, savings) {
    $scope.itemsToAdd = [];
    $scope.resultsToAdd = [];
    $scope.update = false; //whether a project is being added or updated
    $scope.savingsNumber = true; //checks for number inputs for savings
    $scope.hoursNumber = true; //checks for number inputs for hours
    $scope.hasImage = false;

    $scope.sharedData = sharedData;

    //date options for the date picked
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2010:-0'
    };

    //array of project disciplines
    $scope.disciplines = disciplines.selectable;

    //output of disciplines check boxes
    $scope.projectDisciplines = [];

    //------------------------------------------------------------------------------------------------------------------
    
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function () {
        // check if user is already logged in
        if (!sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else {
            if (sharedData.project === null) {
                $scope.addNew();
            }
            else {
                $scope.itemsToAdd.push(sharedData.project);
                if (sharedData.project.image !== null) {
                    $scope.hasImage = true;
                }

                //initialize date
                $scope.itemsToAdd[0].date = new Date(sharedData.project.year, sharedData.project.month - 1, sharedData.project.day);

                //updating results
                for (var i = 0; i < sharedData.project.result.length; i++) {
                    $scope.resultsToAdd.push({
                        summary: sharedData.project.result[i].summary,
                        details: sharedData.project.result[i].details,
                        savings: sharedData.project.result[i].savings,
                        hours: sharedData.project.result[i].hours
                    });
                }

                //updating disciplines
                for (var j = 0; j < sharedData.project.discipline.length; j++) {
                    switch (sharedData.project.discipline[j]) {
                        case "Software":
                            $scope.disciplines[0].ticked = true;
                            break;
                        case "Systems":
                            $scope.disciplines[1].ticked = true;
                            break;
                        case "Electrical":
                            $scope.disciplines[2].ticked = true;
                            break;
                        case "Mechanical":
                            $scope.disciplines[3].ticked = true;
                            break;
                        case "Production":
                            $scope.disciplines[0].ticked = true;
                            break;
                        case "Integration and Test":
                            $scope.disciplines[1].ticked = true;
                            break;
                        case "Corporate":
                            $scope.disciplines[2].ticked = true;
                            break;
                        case "Program Management":
                            $scope.disciplines[3].ticked = true;
                            break;
                    }
                }

                $scope.update = true;
                sharedData.project = null;
            }
        }
    };

    //------------------------------------------------------------------------------------------------------------------
    
    //discipline related functions
    
    /**
     * Updates a project's disciplines
     * @param project
     */
    $scope.updateDisciplines = function (project) {
        for (var i = 0; i < $scope.disciplines.length; i++) {
            var checked = $scope.disciplines[i].ticked;
            if (checked) {
                project.discipline.push($scope.disciplines[i].label);
            }
        }
    };

    /**
     * Alerts the values in the output disciplines array
     */
    $scope.alertDisciplines = function () {
        var result = "";
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                result += ($scope.disciplines[i].label + " ");
            }
        }
        alert(result);
    };

    /**
     * Checks if none of the disciplines are selected
     * @returns {boolean} true if none of the disciplines are ticked, false otherwise
     */
    $scope.noDiscipline = function () {
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                return false;
            }
        }
        return true;
    };

    /**
     * Checks if the savings input is a number
     * @param index index of result
     */
    $scope.checkSavingsNumberInput = function (index) {
        var input = $scope.resultsToAdd[index].savings;
        if (input === '') {
            $scope.savingsNumber = true;
        }
        else {
            $scope.savingsNumber = !isNaN(input);
        }
    };

    /**
     * Checks if the hours input is a number
     * @param index index of result
     */
    $scope.checkHoursNumberInput = function (index) {
        var input = $scope.resultsToAdd[index].hours;
        if (input == "") {
            $scope.hoursNumber = true;
        }
        else {
            $scope.hoursNumber = !isNaN(input);
        }
    };
    
    //------------------------------------------------------------------------------------------------------------------
    
    //Project form-related functions
    
    /**
     * Adds a new results field
     */
    $scope.addResultsField = function () {
        $scope.resultsToAdd.push({
            summary: '',
            details: '',
            savings: '',
            hours: ''
        });
    };

    /**
     * Adds a new project form
     */
    $scope.addNew = function () {
        if ($scope.itemsToAdd.length >= 1) {
            alert("Fill out existing report(s) first!");
        }
        else {
            $scope.addResultsField();
            $scope.itemsToAdd.push({
                title: '',
                discipline: [],
                disciplineString: '',
                month: '',
                day: '',
                year: '',
                date: '',
                manager: '',
                team: '',
                summary: '',
                result: $scope.resultsToAdd,
                image: null
            });
        }
    };

    /**
     * Checks if the current manager is in the database and redirects accordingly
     */
    $scope.redirect = function () {
        var promise = database.getManagerByEmail(sharedData.globalManager[0].email);

        promise.then(function (data) {
            sharedData.project = null;
            $scope.managerExists = (data !== null);
            if ($scope.managerExists) {
                $window.location.href = "#!/previous";
            }
            else {
                sharedData.logOut();
            }
        });
    };

    /**
     * Deletes a project form
     */
    $scope.delProjectForm = function () {
        sharedData.project = null;
        if (sharedData.projectList.length > 0) {
            $window.location.href = "#!/preview";
        }
        else {
            $scope.redirect();
        }
    };

    /**
     * Cancels a project edit
     */
    $scope.cancelEdit = function () {
        sharedData.project = null;
        $window.location.href = "#!/previous";
    };

    /**
     * Removes a currently uploaded image
     */
    $scope.removeImage = function () {
        $scope.itemsToAdd[0].image = null;
        $scope.hasImage = false;
    };

    /**
     * Checks for any invalid parameters (negative numbers, empty fields)
     * @param item project
     * @returns {boolean} true if something is invalid, false otherwise
     */
    $scope.checkInvalids = function (item) {
        if (item.title.replace(/\s+/g, '') == ""
            || item.summary.replace(/\s+/g, '') == ""
            || $scope.noDiscipline()
            || item.team.replace(/\s+/g, '') == ""
            || item.date === undefined) {
            return true;
        }
        else {
            for (var i = 0; i < item.result.length; i++) {
                if (item.result[i].savings < 0 || item.result[i].hours < 0
                    || isNaN(item.result[i].savings) || isNaN(item.result[i].hours)
                    || item.result[i].summary.replace(/\s+/g, '') == ""
                    || item.result[i].details.replace(/\s+/g, '') == "") {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Deletes a result field at a given index
     * @param index
     */
    $scope.delResultsField = function (index) {
        if ($scope.resultsToAdd.length > 1) {
            $scope.resultsToAdd.splice(index, 1);
        }
        else {
            alert("Cannot delete only result")
        }
    };

    /**
     * Updates a project's month/day/year fields given a date
     * @param item project
     * @returns {*} the project with its date updated
     */
    $scope.parseDate = function (item) {
        item.month = item.date.getMonth() + 1;
        item.day = item.date.getDate();
        item.year = item.date.getFullYear();
        return item;
    };

    
    //------------------------------------------------------------------------------------------------------------------
    
    //Adding/updating projects
    
    /**
     * Adds a project to the items array
     * @param item project to be added
     */
    $scope.addProject = function (item) {
        //if any required fields are empty
        if ($scope.checkInvalids(item)) {
            alert("Error in 1 or more fields");
        }
        else {
            item = $scope.parseDate(item);
            item.savings = savings.projectSavings(item);
            item.hours = savings.projectHours(item);
            
            if (item.savings < 0 || item.hours < 0) {
                alert("Error: either savings or hours are negative");
            }
            else if (item.savings <= 0 && item.hours <= 0) {
                alert("Error: project has no savings");
            }
            else {
                item.manager = sharedData.globalManager[0];
                $scope.updateDisciplines(item);

                sharedData.pushToProjectList(angular.copy(item));
                $window.location.href = "#!/preview";
            }
        }
    };

    /**
     * Updates a project if it already exists in the database
     * @param item updated project
     */
    $scope.updateProject = function (item) {
        if ($scope.checkInvalids(item)) {
            alert("Error in 1 or more fields");
        }
        else {
            item = $scope.parseDate(item);
            item.savings = savings.projectSavings(item);
            item.hours = savings.projectHours(item);
            
            if (item.savings < 0 || item.hours < 0) {
                alert("Error: either savings or hours are negative");
            }
            else if (item.savings <= 0 && item.hours <= 0) {
                alert("Error: project has no savings");
            }
            else {
                if (sharedData.fromDatabase) {
                    var promise = database.updateProjectFromDatabase(item._id, item);
                    promise.then(function() {
                        sharedData.project = null;
                        sharedData.fromDatabase = false;
                        $window.location.href = "#!/previous";
                    });
                }
                else {
                    sharedData.pushToProjectList(angular.copy(item));
                    $window.location.href = "#!/preview";
                }
            }
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});