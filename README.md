# rce_non_shiny

=## Getting Started

These instructions will get you a copy of the project up and running on 
your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Git    
- NodeJS + npm (node package manager) version 7.7.4+    
- Microsoft Visual Studio 2012 (or above) with the "Node.js Developer Tools for Visual Studio" plugin
-MongoDB version 3.2+

### Setting Up Development Environment

Clone the git repository:

git clone https://github.com/mathematica-mpr/rce_non_shiny.git

Navigate to the package.json file in the project and install the dependencies:

npm install

Start up MongoDB

Navigate to C:\Program Files\MongoDB\ in Windows Powershell and enter the following command:

\Server\3.2\bin\mongod.exe --dbpath .\data

This starts up MongoDB.

Start up NodeJS (run as admin)

Navigate to server.js and run nodemon server.js 

Open the browser to 
Start up NodeJS (run as admin)

Navigate to server.js and run nodemon server.js 

Open the browser to localhost://3000/
