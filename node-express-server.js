/*Express*/
var path = require('path');
const express = require('express');
const app = express();

/* Middleware*/
//Configure the app to use Express:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/*Spin up the Server*/
app.use(express.static('client'))

// Listen on port 3000
app.listen(3000, function () {
    console.log('Listening on port 3000')
})

//Get route
app.get('/get', async (request, response)=> {
    try {
        response.send('');
    } catch (error) {
        console.log(error);
    }
})

//Post route
app.post('/post', async (request, response)=>{
    try {      
        response.send('');         
    } catch (error) {
        console.log(error);
    }
})