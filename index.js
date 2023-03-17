const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const tasksData = fs.readFileSync('tasksData.json');
const tasks = JSON.parse(tasksData);

// Allow cross-origin requests from any domain
app.use(cors(origin = "*"));

// Define your routes and middleware here
// ...

const port = process.env.PORT || 3000;

app.get('/tasks', (req, res) => {
    res.send(tasks);
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});