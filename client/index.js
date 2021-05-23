/*Global Variables*/

// Post Route Function
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
        return returnedData;
    }catch(error) {
        console.log("error", error);
    }
}

// Get Route
const request = await fetch('/get'); //This get route returns the data
    try {
        const responseData = await request.json();                  
    }catch(error){
        console.log("error", error);
    }
