const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');

require('dotenv/config')

//middleware
const app = express();

app.use(express.json());

app.use(cors({orgin:'*'}))

const initialization = require('../utils/bulkCreate');
initialization()

const ship = require('../ships/routers/ship');
app.use('/ship', ship)

const role = require('../employees/routers/role');
app.use('/role', role)

const deboardingtype = require('../employees/routers/deboardingType');
app.use('/deboardingtype', deboardingtype)

const employee = require('../employees/routers/employee');
app.use('/employee', employee)

const shipEmployee = require('../ships/routers/shipEmployee');
app.use('/shipemployee', shipEmployee)

const rank = require('../employees/routers/rank');
app.use('/rank', rank)

const department = require('../employees/routers/department');
app.use('/department', department)

const dbURI = 'mongodb://localhost:27017/ship-crew-tracker_DB'; 
async function connectDB() {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
}

connectDB();

app.listen(8000, (err)=>{
    if(err) console.log(err)
    else console.log("Server is running on 8000")
})