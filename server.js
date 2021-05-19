/*Express*/
var path = require('path');
const express = require('express');
const app = express();

/* Middleware*/
//Configure the app to use Express:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const fs = require('fs');

/*Spin up the Server*/
app.use(express.static('client'))

// Listen on port 3000
app.listen(3000, function () {
    console.log('Listening on port 3000')
})

//Get route for the data
app.get('/retrieve', sendData);
    function sendData (request, response) {
        fs.readFile ('schedule.json', 'utf8', (err, scheduleData)=> {
            if (err) throw err;
            response.send(scheduleData);
        })
    }

//Post route for adding a name and returning the full data
app.post('/add', addData);
    function addData (request, response) {

        fs.readFile ('schedule.json', 'utf8', (err, file)=> {
            if (err) throw err;
            let scheduleData = JSON.parse(file);

            let dateIndex = 0;
            
            for (i=0; i<scheduleData.data.length; i++) { //look for the 'date' as the 'date' data in the indexed array item.
                if (scheduleData.data[i].date == request.body.date) dateIndex = i;
            }

            for (i=0; i<scheduleData.data[dateIndex].prayerSlots.length; i++) {    //find the prayer slot        
                if (scheduleData.data[dateIndex].prayerSlots[i].index == request.body.index) {
                    const prayerName = ` ${request.body.firstName} ${request.body.lastInitial}`;
                    scheduleData.data[dateIndex].prayerSlots[i].names.push(prayerName);
                }
            }
            
            response.send(scheduleData);
            
            const jsonContent = JSON.stringify(scheduleData);
            fs.writeFile('schedule.json', jsonContent, 'utf8', (err)=> {
                if (err) {
                    console.log ("Error writing to file:", err);
                } else {
                    console.log("File saved.");
                }
            })
        })
    }
