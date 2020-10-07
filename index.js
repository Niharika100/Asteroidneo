const { response } = require('express');
const express = require('express');
const fetch = require('node-fetch');

// stores all the functions of the express package in app variable
const app = express();

// listen from the users
app.listen(3000, () => { console.log("Listen..") });

// Express to host static files on the localhost
//  web server's job is to serve any file that is in the web server
app.use(express.static('public'));

// give output in  json format
app.use(express.json({ limit: '1mb' }));

// get data from the server
var Sdate;
var Edate;
var api_url;
app.post('/neo', async (request, response) => {
    Sdate = request.body.from_date;
    Edate = request.body.to_date;
    console.log(Sdate);
    console.log(Edate);
    api_url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + Sdate + '&end_date=' + Edate + '&api_key=p3YU2TsqQenazSQjiPCuY8vHyrbmBjQfzJY7wYZu';

    // fetch the data from the api
    const data = await fetch(api_url);

    // convert the data into json format
    const data1 = await data.json();
    
    // send data to client server
    response.json(data1)
})
