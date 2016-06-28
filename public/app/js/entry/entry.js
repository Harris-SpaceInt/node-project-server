'use strict';

var app = angular.module('entry', ['myApp']);

app.component('entry', {
    templateUrl: '../views/entry.template.html'
});

app.controller('entryCtrl', function ($scope, $window, sharedData, database) {
    $scope.itemsToAdd = [];
    $scope.resultsToAdd = [];
    $scope.update = false; //whether a project is being added or updated
    $scope.savingsNumber = true;
    $scope.hoursNumber = true;
    $scope.hasImage = false;
    
    //date options for the date picked
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2010:-0'
    };
    
    //array of project disciplines
    $scope.disciplines = [{
        label: "Software",
        ticked: false
    }, {
        label: "Systems",
        ticked: false
    }, {
        label: "Electrical",
        ticked: false
    }, {
        label: "Mechanical",
        ticked: false
    }, {
        label: "Production",
        ticked: false
    }, {
        label: "Integration and Test",
        ticked: false
    }, {
        label: "Corporate",
        ticked: false
    }, {
        label: "Program Management",
        ticked: false
    }];
    
    //output of disciplines check boxes
    $scope.projectDisciplines = [];

    /**
     * Updates a project's disciplines
     * @param project
     */
    $scope.updateDisciplines = function(project) {
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
    $scope.alertDisciplines = function() {
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
     * @returns {boolean}
     */
    $scope.noDiscipline = function() {
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
    $scope.checkSavingsNumberInput = function(index) {
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
    $scope.checkHoursNumberInput = function(index) {
        var input = $scope.resultsToAdd[index].hours;
        if (input == "") {
            $scope.hoursNumber = true;
        }
        else {
            $scope.hoursNumber = !isNaN(input);
        }
    };
    
    //------------------------------------------------------------------------------------------------------------------
    // initialize the page

    /**
     * Runs when the page is loaded
     */
    $scope.pageInit = function() {
        // check if user is already logged in
        if (!sharedData.loggedIn()) {
            // user is not logged in
            $window.location.href = "#!/login";
        }
        else {
            if(sharedData.project == null) {
                $scope.addNew();
            }
            else {
                $scope.itemsToAdd.push(sharedData.project);
                if (sharedData.project.image !== null) {
                    $scope.hasImage = true;
                }
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
    
    /**
     * Adds a new results field
     */
    $scope.addResultsField = function() {
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
     * Deletes a project form
     */
    $scope.delProjectForm = function() {
        if (sharedData.projectList.length > 0) {
            $window.location.href = "#!/preview";
        }
        else {
            $window.location.href = "#!/user";
        }
    };

    /**
     * Removes a currently uploaded image
     */
    $scope.removeImage = function() {
        $scope.itemsToAdd[0].image = null;
        $scope.hasImage = false;
    };
    
    /**
     * Checks for any invalid parameters (negative numbers, empty fields)
     * @param item
     * @returns {boolean} true if something is invalid, false otherwise
     */
    $scope.checkInvalids = function(item) {
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
     * Deletes a results field at a given index
     */
    $scope.delResultsField = function(index) {
        if ($scope.resultsToAdd.length > 1) {
            $scope.resultsToAdd.splice(index, 1);
        }
        else {
            alert("Cannot delete only result")
        }
    };

    /**
     * Updates a project's month/day/year fields given a date
     * @param item
     * @returns {*}
     */
    $scope.parseDate = function(item) {
        var month = item.date.getMonth() + 1;
        var day = item.date.getDate();
        var year = item.date.getFullYear();
        item.month = month;
        item.day = day;
        item.year = year;
        return item;
    };

    /**
     * Updates a project's savings and saved hours
     * @param item
     * @returns {*}
     */
    $scope.calculateSavings = function(item) {
        item.result = angular.copy($scope.resultsToAdd);
        var grand_savings = 0, grand_hours = 0;
        for (var j = 0; j < item.result.length; j++) {
            grand_savings += item.result[j].savings;
            grand_hours += item.result[j].hours;
        }

        if ($scope.resultsToAdd.length == 0) {
            alert("Error: Project does not have any results.");
        }
        else if (grand_savings <= 0 && grand_hours <= 0) {
            alert("Error: Project does not have any savings.");
        }
        else {
            item.savings = grand_savings;
            item.hours = grand_hours;
        }
        return item;
    };
    
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
            item = $scope.calculateSavings(item);
            item.manager = sharedData.globalManager[0];
            $scope.updateDisciplines(item);
            
            sharedData.pushToProjectList(angular.copy(item));
            $window.location.href = "#!/preview";
        }
    };

    /**
     * Updates a project if it already exists in the database
     * @param item
     */
    $scope.updateProject = function(item) {
        if ($scope.checkInvalids(item)) {
            alert("Error in 1 or more fields");
        }
        else {
            item = $scope.parseDate(item);
            item = $scope.calculateSavings(item);
            if (sharedData.fromDatabase) {
                database.updateProjectFromDatabase(item.id, item);
                sharedData.project = null;
                sharedData.fromDatabase = false;
                $window.location.href = "#!/previous";
            }
            else {
                sharedData.pushToProjectList(angular.copy(item));
                $window.location.href = "#!/preview";
            }
        }
    };

    
    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});