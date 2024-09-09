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

        if(type.typeName === 'StayIn' || type.typeName === 'StayOut'){
          employee.currentStatus = 'Out';
        }else if(type.typeName === 'OnLeave'){
          employee.currentStatus = type.typeName;
          employee.leaveStatus = true;
        }else{
          employee.currentStatus = type.typeName;
        }

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
      em.status = true;
      await em.save();
      const employee = await Employee.findById(employeeId);
      employee.currentStatus = 'In';
      employee.leaveStatus = false;
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

    let whereClause = {
      checkOutTime: { $gte: startOfDay, $lte: endOfDay }
    };

    if (req.query.search && req.query.search !== 'undefined') {
      const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
      console.log(`Search Term: ${searchTerm}`); // Debug: Print the search term

      if (searchTerm) { // Ensure searchTerm is not empty
        whereClause['employeeId.name'] = {
          $regex: new RegExp(searchTerm, 'i')
        };
      }
    }
  

    const employeeMonitoring = await EmployeeMonitoring.find(whereClause).populate([
      { path: 'employeeId', select: 'name' },
      { path: 'purpose', select: 'typeName' }
    ]);

    res.send(employeeMonitoring);
  } catch (error) {
    res.status(500).send(error.message);
  }
});




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


router.get('/getstayout', async (req, res) => {
  try {
    let purpose = await DeboardingType.findOne({ typeName: 'StayOut' });
    let id = purpose._id;
    const employeeMonitoring = await EmployeeMonitoring.find({
      currentStatus: false, purpose: id
    }).populate([
      { path: 'employeeId', select: 'name' }, // Corrected 'selece' to 'select'
      { path: 'purpose', select: 'typeName' }, // Corrected 'selece' to 'select'
    ]);

    res.send(employeeMonitoring);
  } catch (error) {
    res.status(500).send(error); // Optionally, you can add status code for error
  }
});

router.get('/getstayin', async (req, res) => {
  try {
    let purpose = await DeboardingType.findOne({ typeName: 'StayIn' });
    let id = purpose._id;
    const employeeMonitoring = await EmployeeMonitoring.find({
      currentStatus: false, purpose: id
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