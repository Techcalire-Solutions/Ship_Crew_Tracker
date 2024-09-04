const express = require('express');
const router =express.Router();

const Employee = require('../models/employee')

router.post('/add', async(req,res)=>{
    const{ name, employeeCode, leaveStatus, deboardingTypeId, status, roleId, phoneNumber, email, joiningDate, address,
      rankId, departmentId 
     } = req.body;
    try {
        const employee = new Employee({ name, employeeCode, leaveStatus, deboardingTypeId, status, roleId, phoneNumber, 
          email, joiningDate, address, rankId, departmentId  })
        await employee.save()
        res.send(employee)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/findbyid/:id', async(req, res)=>{
  try {
    const employee = await Employee.findById(req.params.id)
  } catch (error) {
    res.send(error)
  }
})

   
router.get('/findall', async(req, res)=>{
    let whereClause = {}
    let limit;
    let offset;
    if (req.query.pageSize && req.query.pageSize != 'undefined'  && req.query.page && req.query.page != 'undefined' ) {
        limit = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
    } else {
      whereClause.status = true;
    }
    
    if (req.query.search && req.query.search != 'undefined') {
      const searchTerm = req.query.search.trim().toLowerCase();
        console.log(searchTerm);
        
        whereClause = {
          ...whereClause,
          $or: [
            { name: { $regex: new RegExp(searchTerm, 'i') } },
            { employeeCode: { $regex: new RegExp(searchTerm, 'i') } },
          ],
        }
    }

    try {
        const result = await Employee.find(whereClause).skip(offset).limit(limit).sort({ _id: -1 })
        .populate([
          { path: 'roleId', select: 'roleName' },
          { path: 'deboardingTypeId', select: 'typeName' },
          { path: 'rankId', select: 'rankName' },
          { path: 'departmentId', select: 'departmentName' }
        ]);
        if (req.query.search) {
            totalCount = await Employee.countDocuments(whereClause);
        } else {
            totalCount = await Employee.countDocuments();
        }

        if (req.query.page && req.query.pageSize && req.query.page != 'undefined' && req.query.pageSize != 'undefined') {
            const response = {
              count: totalCount,
              items: result,
            };
            res.json(response);
          } else {
            res.send(result);
          }
    } catch (error) {
        res.send(error)
    }
})

router.patch('/edit/:id', async (req, res) => {
  const {name, employeeCode, leaveStatus, deboardingTypeId, status, roleId, phoneNumber, email, joiningDate, address,
     rankId, departmentId } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id)
    employee.name = name;
    employee.employeeCode = employeeCode;
    employee.leaveStatus = leaveStatus;
    employee.deboardingTypeId = deboardingTypeId;
    employee.roleId = roleId;
    employee.status = status;
    employee.phoneNumber = phoneNumber;
    employee.email = email;
    employee.joiningDate = joiningDate;
    employee.address = address;
    employee.rankId = rankId;
    employee.departmentId = departmentId;
    await employee.save();
    res.send(employee)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const employee = await Employee.deleteOne({_id:req.params.id})
    res.send(employee)
  } catch (error) {
    res.send(error);
  }
})

router.patch('/updatestatus/:id', async (req, res) => {
  const status = req.body.status;
  try {
    const result = await Employee.findById(req.params.id);
    result.status = status;
    await result.save();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
})

module.exports = router