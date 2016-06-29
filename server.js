// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost');    // connect to our database

var Project    = require('./app/models/project');
var Manager    = require('./app/models/manager');
var Report    = require('./app/models/report');

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
    res.json({ message: 'valid routes: /projects, /projects/:id, /unreported' });
});


// on routes that end in /projects
// ----------------------------------------------------
router.route('/projects')

    // create a project (accessed at POST http://localhost:8080/api/projects)
    .post(function(req, res) {

        var project = new Project();      // create a new instance of the Project model
        project.title = req.body.title;   // set the projects fields (comes from the request)
        project.generated = req.body.generated;
        project.discipline = req.body.discipline;
        project.summary = req.body.summary;
        project.team = req.body.team;
        project.image = req.body.image;
        project.savings = req.body.savings;
        project.hours = req.body.hours;
        project.day = req.body.day;
        project.month = req.body.month;
        project.year = req.body.year;
        
        project.manager = req.body.manager;
        console.log(req.body.manager);
        // project.manager.name = req.body.manager.name;
        // project.manager.unit = req.body.manager.unit;
        // project.manager.function = req.body.manager.function;
        // project.manager.department = req.body.manager.department;
        // project.manager.phone = req.body.manager.phone;
        // project.manager.email = req.body.manager.email;
        
        
        // save the project and check for errors
        project.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Project created' });
        });
    })

    // get all the projects (accessed at GET http://localhost:8080/api/projects)
    .get(function(req, res) {
        Project.find({})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);

                res.json(projects);
            });
    });

// on routes that end in /projects/:project_id
// ----------------------------------------------------
router.route('/projects/:project_id')

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

// on routes that end in /unreported
// ----------------------------------------------------
router.route('/unreported')

    // get all projects not in reports (accessed at GET http://localhost:8080/api/unreported)
    .get(function(req, res) {
        Project.find({generated: false})
            .populate('manager')
            .exec(function(err, projects) {
                if (err)
                    res.send(err);
    
                res.json(projects);
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

// on routes that end in /managers
// ----------------------------------------------------
router.route('/managers/:manager_id')

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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// APPLICATION 
// ============================================================================
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {
    res.sendfile('./public/app/views/index.html');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);