'use strict';

var app = angular.module('preview', ['myApp']);

app.component('preview', {
    templateUrl: 'templates/preview.template.html'
});

app.controller('previewCtrl', function ($scope, $window, sharedData, database) {
    $scope.items = sharedData.projectList;

    /**
     * Clears the manager and returns the user to the
     * login page
     */
    $scope.logOut = function() {
        sharedData.clearGlobalManager();
        $window.location.href = "#!/login";
    };

    /**
     * Goes back to user page without logging changes
     */
    $scope.goBack = function() {
        $window.location.href = "#!/user";
    };
    
    /**
     * Edits an existing project form
     * @param index index in the items array
     */
    $scope.edit = function (index) {
        sharedData.project = $scope.items[index];
        $scope.items.splice(index, 1);
        $window.location.href = "#!/entry";
    };

    /**
     * Deletes a project from the items array
     * @param index index in items
     */
    $scope.deleteProject = function (index) {
        var confirmation = confirm("Are you sure you want to delete this project?");
        if (confirmation) {
            $scope.items.splice(index, 1);
        }
    };

    /**
     * Add contents in items array to the database
     */
    $scope.addToDB = function() {
        for (var i = 0; i < $scope.items.length; i++) {
            database.addProjectToDatabase($scope.items[i]);
            console.log("adding to db...");
        }
        $scope.items = [];
        sharedData.clearProjectList();
        $window.location.href = "#!/user";
    };

    /**
     * For adding additional projects
     * Reloads to entry page
     */
    $scope.addNew = function() {
        $window.location.href = "#!/entry";
    };

    /**
     * Converts the contents of a project's disciplines array to a string
     * @param project
     * @returns {string}
     */
    $scope.getDisciplineString = function(project) {
        var disciplineString = "";
        for (var j = 0; j < project.discipline.length - 1; j++) {
            disciplineString += (project.discipline[j] + ", ");
        }
        return (disciplineString + project.discipline[project.discipline.length - 1]);
    };
});