/*Express*/
var path = require('path');
const express = require('express');
const app = express();

/* Middleware*/
//Configure the app to use Express:
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { writeFile, readFile } = require('fs').promises;

/*Spin up the Server*/
app.use(express.static('client'))

// Listen on port 3000
app.listen(3000, function () {
    console.log('Listening on port 3000')
})

//Get route for the data
app.get('/retrieve', async (request, response)=> {
    try {
        const file = await readFile('schedule.json');
        response.send(file);
    } catch (error) {
        console.log(error);
    }
})

//Post route for adding a name and returning the full data
app.post('/add', async (request, response)=>{
    try {
        const file = await readFile('schedule.json');
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
        
        const write = await writeFile('schedule.json', jsonContent);
    } catch (error) {
        console.log(error);
    }
})