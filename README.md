# node-project-server
node-project-server is a MEAN (Mongodb, Express, Angularjs, Node.js) web application that focuses on streamlining and automating the process of submitting project reports at Harris Corportation to track savings throughout the company.

The client-side is built using Angularjs (with Foundation css framework for styling), and uses SPA (Single Page Application) principals such as angular routing to deliver a seamless user experience navigating through the application. 
The middleware of the application uses Express.js to provide a REST api for the client application to share data with a Mongodb database.

## Dependencies you need before following the instructions below:

    git (http://git-scm.com/)
  
    node (http://nodejs.org/en/download/)
  
    bower ($ npm install -g bower)

## Setting up the server

### Starting Mongo (Red Hat Enterprise Linux 6):
    
    $ wget -O ~/Downloads 'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.2.8.tgz'
        
    $ tar -xvzf ~/Downloads/mongodb-linux-x86_64-rhel62-3.2.8.tgz -C ~/Documents
    
    $ mkdir ~/data/db
    
    $ ./~/Documents/mongodb-linux-x86_64-rhel62-3.2.8/bin/mongod --dbpath ~/data/db

### Starting the Server (START MONGO BEFORE DOING THIS):

    $ git clone https://github.com/amaczugowski/node-project-server
    
    $ cd node-project-server
  
    $ npm install && bower install
    
    $ npm install -g pm2
    
    $ pm2 start server.js
      
### Change the url that the client will grab data from
    
    get your public ip in the terminal:
            
        > $ ifconfig
            
        > look for "eth" and then a number (ex. "eth0" or "eth1")
            
        > on the next line, "inet addr" is your public ip
            
    open node-project-server/public/js/config/url.constant.js
    
    change the ip on the line with the comment to the public ip of the server 
    
### Access the website without typing the port number:

    download and install nginx (http://nginx.org/en/download.html)
    
    download the config files:
    
        > $ git clone https://github.com/amaczugowski/nginx-project-server
    
    nginx-project-server contains the config files for nginx
    
    follow the instructions in nginx-project-server/README.md
    
### (optional) Change the port that the server will run on:

    open node-project-server/server.js
    
    find "var port = process.env.PORT || 8080;"
    
    change 8080 to whatever port you want to run on
    
    restart the server:
    
        > $ pm2 restart 0

## After configuring
    
When you restart the computer, you will be able to run the server by starting mongo:
    
    $ ./~/Documents/mongodb-linux-x86_64-rhel62-3.2.8/bin/mongod --dbpath ~/data/db
    
and starting the node server:

    $ pm2 start server.js
