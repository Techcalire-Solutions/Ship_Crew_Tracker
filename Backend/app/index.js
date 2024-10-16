const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const path = require('path');

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

const em = require('../employees/routers/employeeMonitoring');
app.use('/employeemonitoring', em)

const log = require('../employees/routers/log');
app.use('/logs', log);

app.use('/employees/images', express.static(path.join(__dirname, '../employees/images')));

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error', err));



// main().catch(e => {
//   console.error(e);
//   process.exit(1);
// })
// .finally(async () => {
//   await prisma.$disconnect();
// });

app.listen(process.env.PORT, (err)=>{
    if(err) console.log(err)
    else console.log("Server is running on 8000")
})