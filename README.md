# node-project-server
node-project-server is a MEAN (Mongodb, Express, Angularjs, Node.js) web application that focuses on streamlining and automating the process of submitting project reports at Harris Corportation to track savings throughout the company.

The client-side is built using Angularjs (with Foundation css framework for styling), and uses SPA (Single Page Application) principals such as angular routing to deliver a seamless user experience navigating through the application. 
The middleware of the application uses Express.js to provide a REST api for the client application to share data with a Mongodb database.

Required Dependencies:

    git (install with package manager)
  
    npm (install with package manager)
  
    bower ($npm install -g bower)
  
Optional Dependencies:

    pm2 ($npm install -g pm2)
  
    nginx (install with package manager)

Build Instructions for Node (targeted at Linux, but should apply to other OS):

    clone the repo and cd into node-project-server
  
    run $npm install
    
    run $bower install
    
    (optional) change the port that the server will run on
    
        open server.js
        
        find var port = process.env.PORT || 8080;
        
        change 8080 to whatever port you want to run on
      
    change the dataUrl variable in database.factory.js
    
        open public/js/services/database.factory.js
        
        find $scope.dataUrl
        
        change its value to the public ip where the server is running
      
    start the server
    
        if you installed pm2, run $pm2 start server.js
        
        otherwise, run $node server.js
      
    the server should now be running on port 8080 or whatever port you changed it to run on
    
    you can test the server by going to localhost:8080 in your browser
    
Build Instructions for Nginx (requires nginx installation):

    follow these instructions if you want to connect to the node server through port 80 in the browser
    
    this will set up a reverse proxy to allow clients to connect without entering the port number in the browser
    
    clone the repo called nginx-project-server
    
    it contains the config files for nginx
    
    follow the instructions in README.md
