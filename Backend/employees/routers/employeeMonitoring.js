const express = require('express');
const router =express.Router();

const EmployeeMonitoring = require('../models/employeeMonitoring')
const Employee = require('../models/employee');

router.post('/checkout', async(req,res)=>{
    const{ employeeId, checkInTime, checkOutTime, currentStatus, curfewTime, purpose, status } = req.body;
    try {
        const employeemonitoring = new EmployeeMonitoring({ employeeId, checkInTime, checkOutTime, currentStatus, curfewTime, purpose, status })
        await employeemonitoring.save()

        const employee = await Employee.findById(employeeId)
        employee.currentStatus = 'Out';
        await employee.save();
        res.json({employee: employee, employeemonitoring: employeemonitoring})       
    } catch (error) {
       return  res.send(error)       
    }
})

router.patch('/checkin', async (req, res) => {
  const {employeeId, checkInTime} = req.body;
  try {
    const em = await EmployeeMonitoring.findOne({employeeId: employeeId, status: false})
    if(em){
      em.checkInTime = checkInTime;
      em.currentStatus = true;
      await em.save();
      let employee = await Employee.findById(employeeId);
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

module.exports = router