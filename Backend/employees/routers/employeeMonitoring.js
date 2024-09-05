const express = require('express');
const router =express.Router();

const EmployeeMonitoring = require('../models/employeeMonitoring')
const Employee = require('../models/employee');
const DeboardingType = require('../models/deboardingType');

router.post('/checkout', async(req,res)=>{
    const{ employeeId, checkInTime, checkOutTime, currentStatus, curfewTime, purpose, status } = req.body;
    try {

        const employeemonitoring = new EmployeeMonitoring({ employeeId, checkInTime, checkOutTime, currentStatus, curfewTime, purpose, status })
        await employeemonitoring.save()

        const employee = await Employee.findById(employeeId)
        employee.currentStatus = 'Out';
        const type = await DeboardingType.findById(purpose);
        if(type.typeName === 'OnLeave'){
          employee.leaveStatus = true;
        }
        await employee.save();
        res.json({employee: employee, employeemonitoring: employeemonitoring})       
    } catch (error) {
       return  res.send(error)       
    }
})

router.patch('/checkin', async (req, res) => {
  console.log("hhhhhhhhhhhhhhhhhiiiiiiiiiiiiiiii");
  
  const {employeeId, checkInTime} = req.body;
  try {
    const em = await EmployeeMonitoring.findOne({employeeId: employeeId, status: false})
    console.log(em);
    
    if(em){
      em.checkInTime = checkInTime;
      em.currentStatus = true;
      em.status = true;
      await em.save();
      const employee = await Employee.findById(employeeId);
      employee.currentStatus = 'In';
      await employee.save();

      res.json({ employee: employee, employeemonitoring: em})
    }else{
      return res.send("exit log can't find")
    }
  } catch (error) {
    return  res.send(error) 
  }
})

router.get('/gettodays', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 

    const employeeMonitoring = await EmployeeMonitoring.find({
      checkOutTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate([
      {path: 'employeeId', selece: 'name'},
      {path: 'purpose', selece: 'typeName'},
    ])

    res.send(employeeMonitoring);
  } catch (error) {
    res.send(error)
  }
})

router.get('/getbyemployee/:id', async (req, res) => {
  try {
    const employeeMonitoring = await EmployeeMonitoring.find({
      employeeId: req.params.id
    }).populate([
      { path: 'employeeId', select: 'name' }, // Corrected 'selece' to 'select'
      { path: 'purpose', select: 'typeName' }, // Corrected 'selece' to 'select'
    ]);

    res.send(employeeMonitoring);
  } catch (error) {
    res.status(500).send(error); // Optionally, you can add status code for error
  }
});


module.exports = router