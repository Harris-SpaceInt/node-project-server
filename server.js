// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors       = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// configure app to use cors
// this will let angular communicate with rest
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');    // connect to our database

var Project    = require('./app/models/project');
var Manager    = require('./app/models/manager');
var Report     = require('./app/models/report');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'REST API is working.' });
});


// on routes that end in /projects
// ----------------------------------------------------
router.route('/projects')

    // create a project (accessed at POST http://localhost:8080/api/projects)
    .post(function(req, res) {
        
        // define function to save the project with a manager
        var saveProject = function(project, manager) {
            project.manager = manager._id;

            // save the project and check for errors
            project.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Project created' });
            });            
        };
        

        var project = new Project();      // create a new instance of the Project model
        project.title = req.body.title;   // set the projects fields (comes from the request)
        project.discipline = req.body.discipline;
        project.summary = req.body.summary;
        project.team = req.body.team;
        project.savings = req.body.savings;
        project.hours = req.body.hours;
        project.day = req.body.day;
        project.month = req.body.month;
        project.year = req.body.year;
        project.result = req.body.result;

        if (req.body.generated) {
            project.generated = req.body.generated;
        }

        if (req.body.image) {
            project.image = req.body.image;
        }
        
        // search for a manager with the same email in the database
        Manager.findOne({email: req.body.manager.email}, function(err, results) {
            if (err) 
                res.send(err);
            
            // check if manager exists
            if (results === null) {
                // manager with email does not exist
                // create a new manager from the request body
                var manager = new Manager();
                manager.name = req.body.manager.name;
                manager.unit = req.body.manager.unit;
                manager.function = req.body.manager.function;
                manager.department = req.body.manager.department;
                manager.phone = req.body.manager.phone;
                manager.email = req.body.manager.email;
                
                manager.save(function(err, man) {
                    if (err)
                        res.send(err);
                    
                    saveProject(project, man);
                });
            }
            else {
                // manager exists here
                // get the id and store it in the project
                try {
                    saveProject(project, results);
                } catch(e) {
                    res.status(400).send('Saving project unsuccessful');
                }
            }
        });
        
    })

    // get all projects not in reports (accessed at GET http://localhost:8080/api/projects)
    .get(function(req, res) {
        Project.find({generated: false})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);

                res.json(projects);
            });
    });

// on routes that end in /projects/id/:project_id
// ----------------------------------------------------
router.route('/projects/id/:project_id')

    // get the project with that id (accessed at GET http://localhost:8080/api/project/:project_id)
    .get(function(req, res) {
        Project.findById(req.params.project_id)
            .populate('manager')
            .exec(function(err, project) {
                if (err)
                    res.send(err);
    
                res.json(project);
            });
    })

    // update the project with this id (accessed at PUT http://localhost:8080/api/projects/:project_id)
    .put(function(req, res) {
    
        // use our project model to find the project we want
        Project.findById(req.params.project_id, function(err, project) {
    
            if (err)
                res.send(err);
    
            project.title = req.body.title;  // update the project info
            project.discipline = req.body.discipline;
            project.summary = req.body.summary;
            project.team = req.body.team;
            project.savings = req.body.savings;
            project.hours = req.body.hours;
            project.day = req.body.day;
            project.month = req.body.month;
            project.year = req.body.year;
            project.result = req.body.result;

            if (req.body.generated) {
                project.generated = req.body.generated;
            }
            else if (req.body.generated === false) {
                project.generated = false;
            }

            if (req.body.image) {
                project.image = req.body.image;
            }
            else if (req.body.image === null) {
                project.image = null;
            }

            // save the project
            project.save(function(err) {
                if (err)
                    res.send(err);
    
                res.json({ message: 'Project updated' });
            });
    
        });
    })

    // delete the project with this id (accessed at DELETE http://localhost:8080/api/projects/:project_id)
    .delete(function(req, res) {
        Project.remove({
            _id: req.params.project_id
        }, function(err, project) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// on routes that end in /projects/manager/:manager_email
// ----------------------------------------------------
router.route('/projects/manager/:manager_email')

// get all projects the user has submitted (accessed at GET http://localhost:8080/api/projects/manager/:manager_email)
    .get(function(req, res) {
        Manager.findOne({email: req.params.manager_email},
            function(err, manager) {
                Project.find({manager: manager._id, generated: false})
                    .populate('manager')
                    .exec(function(err, projects) {
                        if (err)
                            res.send(err);

                        res.json(projects);
                    });
            });
    });

// on routes that end in /projects/generated
// ----------------------------------------------------
router.route('/projects/generated')

    // get all projects in reports (accessed at GET http://localhost:8080/api/projects/generated)
    .get(function(req, res) {
        Project.find({generated: true})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);

                res.json(projects);
            });
    });

// on routes that end in /projects/generated/:manager_email
// ----------------------------------------------------
router.route('/projects/generated/:manager_email')

    // get all projects in reports from the manager with the matching email
    // (accessed at GET http://localhost:8080/api/projects/generated/:manager_email)
    .get(function(req, res) {
        Manager.findOne({email: req.params.manager_email},
            function(err, manager) {
                Project.find({manager: manager._id, generated: true})
                    .populate('manager')
                    .exec(function(err, projects) {
                        if (err)
                            res.send(err);

                        res.json(projects);
                    });
            });
    });

// on routes that end in /managers
// ----------------------------------------------------
router.route('/managers')

    // get all managers (accessed at GET http://localhost:8080/api/managers)
    .get(function(req, res) {
        Manager.find(function(err, managers) {
            if (err)
                res.send(err);

            res.json(managers);
        });
    });

// on routes that end in /managers/id/:manager_id
// ----------------------------------------------------
router.route('/managers/id/:manager_id')

    // update the manager with this id (accessed at PUT http://localhost:8080/api/managers/:manager_id)
    .put(function(req, res) {
    
        // use our manager model to find the manager we want
        Manager.findById(req.params.manager_id, function(err, manager) {
    
            if (err)
                res.send(err);
    
            manager.name = req.body.name;  // update the manager info
            manager.function = req.body.function;
            manager.department = req.body.department;
            manager.phone = req.body.phone;
            manager.email = req.body.email;
    
            // save the manager
            manager.save(function(err) {
                if (err)
                    res.send(err);
    
                res.json({ message: 'Manager updated' });
            });
    
        });
    });

// on routes that end in /managers/email/:manager_id
// ----------------------------------------------------
router.route('/managers/email/:manager_email')

    // update the manager with this id (accessed at PUT http://localhost:8080/api/managers/:manager_id)
    .get(function(req, res) {

        // use our manager model to find the manager we want
        Manager.findOne({email: req.params.manager_email}, function(err, manager) {
            if (err)
                res.send(err);

            res.json(manager);
        });
    });

// on routes that end in /reports
// ----------------------------------------------------
router.route('/reports')

    // get all reports (accessed at GET http://localhost:8080/api/reports)
    .get(function(req, res) {
        Report.find(function(err, reports) {
            if (err)
                res.send(err);

            res.json(reports);
        });
    })

    // create a report (accessed at POST http://localhost:8080/api/reports)
    .post(function(req, res) {
        var report = new Report();
        report.day = req.body.day;
        report.month = req.body.month;
        report.year = req.body.year;

        req.body.project.forEach(function(element, index, array) {
            report.project.push(element._id);
        });

        // save the report and check for errors
        report.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Report created' });
        });
    });

// on routes that end in /reports/:report_id
// ----------------------------------------------------
router.route('/reports/:report_id')

    // get the report with that id (accessed at GET http://localhost:8080/api/project/:project_id)
    .get(function(req, res) {
        Report.findById(req.params.report_id)
            .populate('project')
            .exec(function(err, report) {
                if (err)
                    res.send(err);

                Project.populate(report.project, {
                    path: 'manager'
                }, function(err, project) {
                    if (err)
                        res.send(err);

                    report.project = project;
                    res.json(report);
                });
            });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// APPLICATION 
// ============================================================================
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);