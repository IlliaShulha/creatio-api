const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');


const app = express();



const tasksData = fs.readFileSync('tasksData.json');
const tasks = JSON.parse(tasksData);

const workflows = {
  "workflows":[
    {
      "Name": "Electricity",
      "PrengiWorkflowID": 108
    },
    {
      "Name": "Elevators",
      "PrengiWorkflowID": 109
    },{
      "Name": "Maintenance",
      "PrengiWorkflowID": 100
    }
  ]
}

const facilities = {
  "facilities":[
    {
      "Name": "Electricity",
      "PrengiFacilityID": 108
    },
    {
      "Name": "Elevators",
      "PrengiFacilityID": 109
    },{
      "Name": "Maintenance",
      "PrengiFacilityID": 100
    }
  ]
}

const newTask = {
    
    "Prengi ID": 1773,
    "Creatio ID": "64c1e783-6566-4dcb-8b42-0f686a179a15",
    "Title": "Landscape courtyard",
    "Description": "Design and implement a low-maintenance landscaping plan for the building's courtyard area.",
    "Created at": "2023-03-19",
    "Last Modified on": "2023-03-21",
    "User created": "Isaac Newton",
    "Stage": "Planning",
    "Facility": "Apartment 204",
    "Modified By": "Julia Roberts",
    "Workflow": "Electricity",
    "Department": "Maintenance department",
    "User Executor": "Illia Shulha",
    "Domain": "demo"
  
  
}


// Allow cross-origin requests from any domain
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Define your routes and middleware here
// ...

const port = process.env.PORT || 3000

app.get('/tasks', (req, res) => {
  const domain = req.query.domainName
  const api_key = req.query.api_key
  const taskNew = req.body.newTask
  console.log("dn is " + domain + ' key is ' + api_key)
  console.log(taskNew)
  if(domain == 'demo' && api_key == "123456"){
    res.send(tasks)
  } else {
    res.send(null)
  }
  
});

app.get('/workflows', (req, res) => {
  const domain = req.query.domainName
  const api_key = req.query.api_key
  console.log("dn is " + domain + ' key is ' + api_key)
  if(domain == 'demo' && api_key == "123456"){
    res.send(workflows)
  } else {
    res.send(null)
  }
  
});

app.get('/facilities', (req, res) => {
  const domain = req.query.domainName
  const api_key = req.query.api_key
  console.log("dn is " + domain + ' key is ' + api_key)
  if(domain == 'demo' && api_key == "123456"){
    res.send(facilities)
  } else {
    res.send(null)
  }
  
});



app.post('/add_task', (req, res) => {

  const domain = req.body.domainName
  const api_key = req.body.api_key
  
  console.log( req.body.newTask[0])
  if(!(domain == 'demo' && api_key == "123456")){
    res.sendStatus(403)
    return
  }

  // Extract the task object from the request body
  const newTask = req.body.newTask;
  sendDataToWebhook(formatTask(newTask[0])) 
  res.send(200)

  /*


  tasks.tasks.push(newTask)
  const updatedTasks = JSON.stringify(tasks, null, 2)

  fs.writeFile('tasksData.json', updatedTasks, 'utf8', (err) => {
    if(err){
      console.error('Error writing file:', err)
      return
    }
    console.log('JSON file updated  successfully')
  })
  */

  //res.send(200)
})


async function sendDataToWebhook(dataToSend) {

  try {
    webhookURL = "https://webhooks.creatio.com/webhooks/e7c06359-eb12-4322-bd51-f4b75b074d4e"
    const response = await axios.post(webhookURL, dataToSend);
    return { success: true, message: 'Data sent to webhook successfully', data: response.data };
  } catch (error) {
    console.error('Error sending data to webhook:', error.message);
    return { success: false, message: 'Error sending data to webhook', error: error.message };
  }
}

function formatTask(inputTask) {
  const prengiID = 1773; // Replace with your constant value
  const creatioID = "64c1e783-6566-4dcb-8b42-0f686a179a15"; // Replace with your constant value
  const createdAt = "2023-03-19"; // Replace with your constant value
  const lastModifiedOn = "2023-03-21"; // Replace with your constant value
  const stage = "Planning"; // Replace with your constant value
  const modifiedBy = "Julia Roberts"; // Replace with your constant value
  const department = "Maintenance department"; // Replace with your constant value
  const userExecutor = "Illia Shulha"; // Replace with your constant value
  const domain = "demo"; // Replace with your constant value

  return {
    "createdTask": {
      "Prengi ID": prengiID,
      "Creatio ID": creatioID,
      "Title": inputTask.title,
      "Description": inputTask.description,
      "Created at": createdAt,
      "Last Modified on": lastModifiedOn,
      "User created": inputTask.user_created,
      "Stage": stage,
      "Facility": inputTask.facility_code,
      "Modified By": modifiedBy,
      "Workflow": inputTask.workflow_code,
      "Department": department,
      "User Executor": userExecutor,
      "Domain": domain
    }
    
  };
}



app.post('/uploadTasks', (req, res) => {

  sendDataToWebhook(tasks) 
  res.send(200)

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});