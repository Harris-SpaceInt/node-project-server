'use strict';

var app = angular.module('display', ['myApp']);

app.controller('displayCtrl', function ($scope, $window, sharedData, database, staticImages) {
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

        // set credentials to admin
        if (!$scope.sharedData.checkAdmin()) {
            $scope.sharedData.setAdmin();
        }
    };

    //--------------------------------------------------------------------------

    /**
     * Logs the user out
     */
    $scope.logOut = function () {
        $scope.sharedData.clearGlobalManager();
        $window.location.href = '#!/login';
    };

    $scope.switchToFull = function () {
        $window.location.href = '#!/previous';
    };

    $scope.addReportsToDisplay = function (report) {
        var promise = database.getReportFromDatabase(report._id);

        promise.then(function () {
            report.project = database.currentReport;
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
            if ($scope.database.projects[i].checked === true) {
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
            if (!$scope.database.projects[i].generated) {
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

                // TODO: fix setting projects to generated when creating reports
                database.updateProjectFromDatabase(database.projects[i].id, database.projects[i]);

                report.savings += $scope.database.projects[i].savings;
                report.hours += $scope.database.projects[i].hours;
                report.project.push($scope.database.projects[i]);
            }
        }

        // add the report to the database
        $scope.database.addReportToDatabase(report);

        // generate and display the pdf
        $scope.createReportPDF(report);
    };

    /**
     * Creates a report pdf from the selected projects
     */
    $scope.createReportPDF = function (data) {
        var docDefinition = {
            pageMargins: [30, 30, 30, 30],
            footer: {
                columns: [
                    {
                        image: staticImages.proprietary,
                        width: 400
                    }
                ]
            },
            content: [
                allProjects(data)
            ],

            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: "center"
                },
                subheader: {
                    bold: true
                }
            }
        };
        pdfMake.createPdf(docDefinition).open("Report.pdf");
    };

    /**
     * Helper function to make PDF separated by pages for each project
     * @param data  The data to print
     * @returns {object []} string that will be used to print to the pdf
     */
    function allProjects(data) {
        var body = [];

        body.push({image: staticImages.harris, width: 300});
        body.push({text: 'Project Reports Summary \n\n', style: 'header'});
        body.push({text: 'Number of reports: ' + data.project.length + '\n\n', style: "subheader"});
        body.push({text: 'Total savings: $' + data.savings + '\n\n', style: "subheader"});
        body.push({text: 'Total time saved: ' + data.hours + ' hours', style: "subheader"});

        data.project.forEach(function (row) {
            var proj = singleProject(row);

            for (var i = 0; i < proj.length; i++) {
                body.push(proj[i]);
            }
        });

        return body;
    }

    /**
     * Helper function to create a page for each project
     * @param data  The data to print
     * @returns {object []} an object used to print to the pdf
     */
    function singleProject(data) {
        var project_body = [];
        project_body.push({image: staticImages.hbx, width: 535, pageBreak: "before"});
        project_body.push({
            table: {
                //widths: ['*', 'auto', 100, '*'],
                headerRows: 1,
                widths: [100, 141, 250],
                body: [
                    [{text: "Project Title", bold: true}, {text: "Team Members", bold: true}, {
                        text: "Project Summary",
                        bold: true,
                        alignment: 'center'
                    }],
                    [data.title, data.team, data.summary]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) return 0;
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                },

                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'gray';
                }
            }
        });
        project_body.push({text: "\n\n"});
        project_body.push({
            table: {
                headerRows: 1,
                widths: [250, 250],
                body: [
                    [{text: "Savings", bold: true, alignment: 'center'}, {
                        text: "Saved Hours",
                        bold: true,
                        alignment: 'center'
                    }],
                    [{text: "$" + data.savings, alignment: 'center'}, {
                        text: data.hours + " hours",
                        alignment: 'center'
                    }]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 0 || i === node.table.body.length) return 0;
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                },

                hLineColor: function (i, node) {
                    return 'black';
                },
                vLineColor: function (i, node) {
                    return 'gray';
                }
            }
        });

        var disciplineString = "";
        for (var j = 0; j < data.discipline.length - 1; j++) {
            disciplineString += (data.discipline[j] + ", ");
        }
        disciplineString += data.discipline[data.discipline.length - 1];

        //if there's an image
        if (data.image !== undefined && data.image !== null) {
            project_body.push({
                table: {
                    headerRows: 1,
                    widths: [250, 250],
                    body: [
                        [{text: "Image", bold: true, alignment: 'center'}, {
                            text: "Discipline(s)",
                            bold: true,
                            alignment: 'center'
                        }],
                        [{image: data.image, width: 200}, {text: disciplineString + "", alignment: 'center'}]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) return 0;
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },

                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'gray';
                    }
                }
            });
            /*
             project_body.push({text: "\nImage:\n", bold: true});
             project_body.push({image: data.image, width: 200});
             */
        }

        project_body.push({text: "\n\n"});
        for (var i = 0; i < data.result.length; i++) {
            project_body.push({
                table: {
                    headerRows: 1,
                    widths: [250, 250],
                    body: [
                        [{text: "Result #" + (i + 1), bold: true, alignment: 'center', colSpan: 2}, {}],
                        [{text: "Improvement Description", bold: true}, {text: "Improvement Results", bold: true}],
                        [$scope.database.getResultById(data.result[i].id).summary, $scope.database.getResultById(data.result[i].id).details]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) return 0;
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 0 : 1;
                    },

                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'gray';
                    }
                }
            });
        }
        return project_body;
    }

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
        var n = 0;
        for (var i = 0; i < $scope.database.projects.length; i++) {
            if ($scope.database.projects[i].checked === true) {
                n += $scope.projectSavings(i);
            }
        }
        return n;
    };

    /**
     * Total savings for a given project
     * @param index
     * @returns {number}
     */
    $scope.projectSavings = function (index) {
        var total = 0;
        for (var i = 0; i < $scope.database.projects[index].result.length; i++) {
            total += $scope.database.projects[index].result[i].savings;
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
                total += $scope.projectHours(i);
            }
        }
        return total;
    };

    /**
     * Total saved hours for a given project
     * @param index
     * @returns {number}
     */
    $scope.projectHours = function (index) {
        var total = 0;
        for (var i = 0; i < $scope.database.projects[index].result.length; i++) {
            total += $scope.database.projects[index].result[i].hours;
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

