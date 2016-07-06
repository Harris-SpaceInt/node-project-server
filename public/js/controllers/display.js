'use strict';

var app = angular.module('display', ['myApp']);

app.controller('displayCtrl', function ($scope, $window, sharedData, database, disciplines, pdf, savings) {
    // controls whether or not the selected reports tab is open
    // initially open
    $scope.showSelectedReports = true;

    // toggles showing a list of previous reports
    $scope.showPrevReports = false;

    // used to change from viewing individual projects to projects 
    // from a report
    $scope.prev_reports = false;

    // used to keep track of which projects are selected
    $scope.checked = [];

    // variables for viewing previous reports
    // stores the projects from the current report
    $scope.report_projects = [];
    // stores the date of the current result
    $scope.report_date = "";
    // stores the current report
    $scope.currentReport = null;

    // field variables for handling column sort
    // show savings with highest first by default
    $scope.reverse = true;
    $scope.sortOrder = "savings";

    // array of disciplines that are selectable
    $scope.disciplines = disciplines.selectable;
    $scope.projectDisciplines = [];

    //--------------------------------------------------------------------------
    // link database factory and sharedData factory with scope variables from
    //   controller to allow the controller to use and update from factory

    $scope.database = database;
    $scope.sharedData = sharedData;

    //--------------------------------------------------------------------------
    // initialize the page on load

    /**
     * Called on page load
     */
    $scope.pageInit = function () {
        // update the database
        $scope.database.getItemsFromDatabase();

        for (var i = 0; i < $scope.database.projects.length; i++) {
            $scope.database.projects[i].visible = true;
        }

        // set credentials to admin
        if (!$scope.sharedData.checkAdmin()) {
            $scope.sharedData.setAdmin();
        }
    };

    //--------------------------------------------------------------------------
    

    $scope.switchToFull = function () {
        $window.location.href = '#!/previous';
    };

    $scope.addReportsToDisplay = function (report) {
        var promise = database.getReportFromDatabase(report._id);

        promise.then(function () {
            report = database.currentReport;
            $scope.setPrevReports();
            if ($scope.prev_reports) {
                $scope.report_projects = [];
                for (var i = 0; i < report.project.length; i++) {
                    $scope.report_projects.push(report.project[i]);
                }
                $scope.report_date = report.month + "/" + report.day + "/" + report.year;
                $scope.currentReport = report;
            }
        });
    };

    /**
     * Hides previous reports from view
     */
    $scope.hideReports = function () {
        $scope.prev_reports = false;
        $scope.report_projects = [];
    };

    /**
     * Sets showPrevReports to its opposite value
     */
    $scope.setShowPrevReports = function () {
        $scope.showPrevReports = !$scope.showPrevReports;
    };

    /**
     * Sets prev_reports to its opposite value
     */
    $scope.setPrevReports = function () {
        $scope.prev_reports = !$scope.prev_reports;
    };

    /**
     * Sets showSelectedReports to its opposite value
     */
    $scope.setSelectedReports = function () {
        $scope.showSelectedReports = !$scope.showSelectedReports;
    };

    /**
     * Controls sorting by category for tabs
     * @param x  The category to sort by
     */
    $scope.setSortOrder = function (x) {
        //reverses display by default for below categories
        if (x === "checked" || x === "savings" || x === "hours" || x === "date") {
            $scope.reverse = ($scope.sortOrder === x) ? !$scope.reverse : true;
        }
        else {
            $scope.reverse = ($scope.sortOrder === x) ? !$scope.reverse : false;
        }
        $scope.sortOrder = x;
    };

    /**
     * Checks if any selection boxes are checked
     * @returns true if there is at least 1 box checked
     */
    $scope.somethingChecked = function () {
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked) {
                return true;
            }
        }
        return false;
    };

    // controls select all and select none
    $scope.majorSelection = false;

    /**
     * Selects or deselects all projects when the box next
     * to select is changed
     */
    $scope.selectFunction = function () {
        if ($scope.majorSelection) {
            $scope.selectAll();
        }
        else {
            $scope.deselectAll();
        }
    };

    /**
     * Selects all projects
     */
    $scope.selectAll = function () {
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if (!$scope.database.projects[i].generated && $scope.database.projects[i].visible) {
                $scope.database.projects[i].checked = true;
            }
        }
    };

    /**
     * Deselects all projects
     */
    $scope.deselectAll = function () {
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if (!$scope.database.projects[i].generated) {
                $scope.database.projects[i].checked = false;
            }
        }
    };

    /**
     * No/all disciplines checked; hides all projects
     */
    $scope.noOrAllDisciplines = function () {
        $scope.database.projects.forEach(function (element) {
            element.visible = true;
        })
    };

    /**
     * Filters the list by disciplines
     */
    $scope.filterDisciplines = function () {
        var selected = [];
        for (var i = 0; i < $scope.disciplines.length; i++) {
            if ($scope.disciplines[i].ticked) {
                selected.push($scope.disciplines[i].label);
            }
        }
        if (selected.length === 0 || selected.length === $scope.disciplines.length) {
            $scope.noOrAllDisciplines();
        }
        else {
            for (var j = 0; j < $scope.database.projects.length; j++) {
                var project = $scope.database.projects[j];
                for (var x = 0; x < project.discipline.length; x++) {
                    var index = selected.indexOf(project.discipline[x]);
                    project.visible = index > -1;
                    if (!project.visible) {
                        project.checked = false;
                    }
                }
            }
        }
    };

    /**
     * Shows the full report for a project
     * @param project
     */
    $scope.showFull = function (project) {
        sharedData.project = project;

        $window.location.href = "#!/previous";
    };


    //------------------------------------------------------------------------------------------------------------------
    // creating reports and generating PDFs

    /**
     * Creates a new report, adds it to the database,
     * and generates a pdf with all the report info
     */
    $scope.createReport = function () {
        var date = new Date();

        // create report with current date
        var report = {
            project: [],
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
            savings: 0,
            hours: 0
        };

        // add all selected projects to the report
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                $scope.database.projects[i].generated = true;
                $scope.database.projects[i].checked = false;

                database.updateProjectFromDatabase(database.projects[i]._id, database.projects[i]);

                report.savings += $scope.database.projects[i].savings;
                report.hours += $scope.database.projects[i].hours;
                report.project.push($scope.database.projects[i]);
            }
        }

        // add the report to the database
        $scope.database.addReportToDatabase(report);

        // generate and display the pdf
        pdf.createReportPDF(report);
    };

    //------------------------------------------------------------------------------------------------------------------


    /**
     * Returns the number of projects that are selected
     * @returns {number} number of projects selected
     */
    $scope.numChecked = function () {
        var n = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                n++;
            }
        }
        return n;
    };

    /**
     * Calculates the total savings from the selected projects
     * @returns {number} amount saved from selected projects
     */
    $scope.totalSavings = function () {
        var total = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                total += savings.projectSavings($scope.database.projects[i]);
            }
        }
        return total;
    };

    /**
     * Calculates the total hours saved from the selected projects
     * @returns {number} amount of hours saved from selected projects
     */
    $scope.totalHours = function () {
        var total = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                total += savings.projectHours($scope.database.projects[i]);
            }
        }
        return total;
    };

    /**
     * Alerts the user when the benchmark is reached
     * @param total_savings total savings
     */
    $scope.benchmark = function (total_savings) {
        return (total_savings >= 100000);
    };


    //------------------------------------------------------------------------------------------------------------------
    // call the initialization function

    $scope.pageInit();
});

