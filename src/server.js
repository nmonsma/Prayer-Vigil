/*Express*/
var path = require('path');
const express = require('express');
const app = express();

/* Middleware*/
//Configure the app to use Express for these:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const cors = require('cors');
// const { constants } = require('buffer');
// app.use(cors());

/*Global Variables*/
//TODO: create a scheduleData object which consists of an array of {'time': '', 'names': []} objects. Then, when a name is submitted, iterate through the array until the item.time matches, and push the new name to the item.names.
let scheduleData = {
    'date': '2021-05-19',
    'prayerSlots': [
        {'index': '1800', 'time': '6:00 - 6:15 PM', 'names': []},
        {'index': '1815', 'time': '6:15 - 6:30 PM', 'names': []},
        {'index': '1830', 'time': '6:30 - 6:45 PM', 'names': []},
        {'index': '1845', 'time': '6:45 - 7:00 PM', 'names': []},
        {'index': '1900', 'time': '7:00 - 7:15 PM', 'names': []},
        {'index': '1915', 'time': '7:15 - 7:30 PM', 'names': []},
        {'index': '1930', 'time': '7:30 - 7:45 PM', 'names': []},
        {'index': '1945', 'time': '7:45 - 8:00 PM', 'names': []},
        {'index': '2000', 'time': '8:00 - 8:15 PM', 'names': []},
        {'index': '2015', 'time': '8:15 - 8:30 PM', 'names': []},
        {'index': '2030', 'time': '8:30 - 8:45 PM', 'names': []},
        {'index': '2045', 'time': '8:45 - 9:00 PM', 'names': []},
        {'index': '2100', 'time': '9:00 - 9:15 PM', 'names': []},
        {'index': '2115', 'time': '9:15 - 9:30 PM', 'names': []},
        {'index': '2130', 'time': '9:30 - 9:45 PM', 'names': []},
        {'index': '2145', 'time': '9:45 - 10:00 PM', 'names': []}
    ]
}

/*Spin up the Server*/
app.use(express.static('client'))

// Listen on port 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

app.get('/retrieve', sendData);
    function sendData (request, response) {
        response.send(scheduleData);
    }

/*Add Route*/
app.post('/add', addData);
    function addData (request, response) {
        for (i=0; i<scheduleData.prayerSlots.length; i++) {            
            if (scheduleData.prayerSlots[i].index == request.body.index) {
                const prayerName = `${request.body.firstName} ${request.body.lastInitial}`;
                scheduleData.prayerSlots[i].names.push(prayerName);
            }
        }
        response.send(scheduleData);
    }