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

const createSchedule = async ()=> {
    const request = await fetch('/retrieve'); //This get route returns the data
    try {
        const responseData = await request.json();
        const radioElement = document.getElementById('radio-buttons');
        
        //Set date
        document.getElementById('prayer-date').setAttribute('value', responseData.date);
  
        //Create the sechedule element:
        for (i=0; i<responseData.prayerSlots.length; i++) {
     
            //Create the radio button
            const radioButton = document.createElement('input');
            radioButton.setAttribute('type', 'radio');
            radioButton.classList.add('radio-button');
            radioButton.setAttribute('id', `${responseData.prayerSlots[i].index}`);
            radioButton.setAttribute('name', 'time');
            radioButton.setAttribute('value', `${responseData.prayerSlots[i].index}`);

            //Create the radio button label
            const radioLabel = document.createElement('label');
            radioLabel.setAttribute('for', `${responseData.prayerSlots[i].index}`);
            radioLabel.innerText = `${responseData.prayerSlots[i].time}`;

            //Create the Content for the Schedule
            const content = document.createElement('div');
            content.classList.add('names');
            content.setAttribute('id', `${responseData.prayerSlots[i].index}-names`);
            content.innerText = responseData.prayerSlots[i].names;

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
    let timeIndex = '';
    const radioButtons = document.getElementsByName('time'); 
    for (i=0; i<radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            timeIndex = radioButtons[i].value;
        }
    };
    
    const data = {
        'firstName': `${document.getElementById('first-name').value}`,
        'lastInitial': `${document.getElementById('last-initial').value.substring(0,1)}`,
        'index': `${timeIndex}`
    };

    postData ('/add', data)
    .then ((response)=> {
        for (i=0; i<response.prayerSlots.length; i++) {
            document.getElementById(`${response.prayerSlots[i].index}-names`).innerText = `${response.prayerSlots[i].names}`;
        }
    });
}

document.getElementById('submit').addEventListener('click', saveSchedule);
createSchedule();