/*Global Variables*/
let globalScheduleObject = {}; //The object that will hold the current scheule.

const postData = async (url = '', data = {})=> {
    const response = await fetch(url, {   
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });
    try {
        const returnedData = await response.json();
        return returnedData;        //This returns the returnedData to the function call
    }catch(error) {
        console.log("error", error);
        return 'error';
    }
}

function findDate(scheduleData, date) { //pass an array to the function
    let index = 0;
    for (i=0; i<scheduleData.length; i++) { //look for the 'date' as the 'date' data in the indexed array item.
        if (scheduleData[i].date == date) index = i;
    }
    return index;
}

const createDateSelect = async ()=> {
    const request = await fetch('/retrieve'); //This get route returns the data
    try {
        const responseData = await request.json();
        const datesList = document.getElementById('prayer-date');
        
        //Iterate through the schedule date objects
        for (i=0; i<responseData.data.length; i++) {
            const dateIterated = responseData.data[i].date;
            
            /*
            // DISPLAY ONLY FUTURE DATES
            // if the date of the current list object is in the future as of YESTERDAY, then create the option
            if (Number(new Date(dateIterated.substring(0,4), dateIterated.substring(5,7)-1, dateIterated.substring(8,10))) > Number(new Date() - 86400000)) {
                const dateElement = document.createElement('option');
                dateElement.setAttribute('value', dateIterated);
                dateElement.innerText = dateIterated;
                datesList.appendChild(dateElement);
            }
            */

            //DISPLAY ONLY ONE DATE
            //if the date fo teh current list object is 'x', then create the option            
            if (dateIterated == 'Every Wednesday') {
                const dateElement = document.createElement('option');
                dateElement.setAttribute('value', dateIterated);
                dateElement.innerText = dateIterated;
                datesList.appendChild(dateElement);
            }



        }
        createSchedule();
    } catch(error) {
        console.log("error", error);
    }
}


const createSchedule = async ()=> {
    const request = await fetch('/retrieve'); //This get route returns the data
    try {
        const responseData = await request.json();
        const date = document.getElementById('prayer-date').value;
        const index = findDate(responseData.data, date);
        globalScheduleObject = responseData.data[index];
        const radioElement = document.getElementById('radio-buttons');
        
        //Remove anything in the radio-buttons element
        radioElement.innerHTML = '';
  
        //Create the sechedule element:
        for (i=0; i<globalScheduleObject.prayerSlots.length; i++) {
     
            //Create the radio button
            const radioButton = document.createElement('input');
            radioButton.setAttribute('type', 'radio');
            radioButton.classList.add('radio-button');
            radioButton.setAttribute('id', `${globalScheduleObject.prayerSlots[i].index}`);
            radioButton.setAttribute('name', 'time');
            radioButton.setAttribute('value', `${globalScheduleObject.prayerSlots[i].index}`);

            //Create the radio button label
            const radioLabel = document.createElement('label');
            radioLabel.setAttribute('for', `${globalScheduleObject.prayerSlots[i].index}`);
            radioLabel.innerText = `${globalScheduleObject.prayerSlots[i].time}`;

            //Create the Content for the Schedule
            const content = document.createElement('div');
            content.classList.add('names');
            content.setAttribute('id', `${globalScheduleObject.prayerSlots[i].index}-names`);
            content.innerText = globalScheduleObject.prayerSlots[i].names;

            //Attach all three
            radioElement.appendChild(radioButton);
            radioElement.appendChild(radioLabel);
            radioElement.appendChild(content);                        
      }                
    }catch(error){
        console.log("error", error);
    }
}

function saveSchedule () {
    //Check if there has been an input
    if (document.getElementById('first-name').value=='' | document.getElementById('last-initial').value=='') {
        alert('Please type your first name and last initial');
    } else {
        //Disable the submit button to debounce
        document.getElementById('submit').disabled = true;

        let timeIndex = '';
        const radioButtons = document.getElementsByName('time'); 
        
        //Figure out which radio button is checked and record its value in timeIndex    
        for (i=0; i<radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                timeIndex = radioButtons[i].value;
            }
        };
        
        //Create the object that will be sent to the server
        const data = {
            'date': `${document.getElementById('prayer-date').value}`,
            'firstName': `${document.getElementById('first-name').value}`,
            'lastInitial': `${document.getElementById('last-initial').value.substring(0,1)}`,
            'index': `${timeIndex}`
        };

        //Send the object to the server, then iterate through the object that is returned to update the names on the signup
        postData ('/add', data)
        .then ((response)=> {
            const index = findDate(response.data, data.date);
            const updatedSchedule = response.data[index];
            for (i=0; i<updatedSchedule.prayerSlots.length; i++) {
                document.getElementById(`${updatedSchedule.prayerSlots[i].index}-names`).innerText = `${updatedSchedule.prayerSlots[i].names}`;
            }
        });

        //Reenable the submit button after 1 sec
        setTimeout(()=>{document.getElementById('submit').disabled = false}, 1000);
    }
}

//Attach the event listener to the save button
document.getElementById('submit').addEventListener('click', saveSchedule);

//Prevent Enter from causing the submit event
document.getElementById('input').addEventListener('submit', (event)=> {event.preventDefault()});

//Attach the event listener to the date select to update the schedule
document.getElementById('prayer-date').addEventListener('change', createSchedule);

//Get the object from the server and update the client-side schedule display
createDateSelect();