const express = require('express');
const router =express.Router();
const path = require('path');
const fs = require('fs');

const Employee = require('../models/employee');
const multer = require('../../utils/multer');
const EmployeeMonitoring = require('../models/employeeMonitoring');

router.post('/add', async(req,res)=>{
    const{ name, employeeCode, leaveStatus, deboardingTypeId, status, roleId, phoneNumber, email, joiningDate, address,
      rankId, departmentId, imageName, imageUrl
     } = req.body;
    try {
        const employee = new Employee({ name, employeeCode, leaveStatus, deboardingTypeId, status, roleId, phoneNumber, 
          email, joiningDate, address, rankId, departmentId, imageName, imageUrl, currentStatus : 'In'  })
        await employee.save()
        res.send(employee)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/findbyid/:id', async(req, res)=>{
  try {
    const employee = await Employee.findById(req.params.id)
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

router.get('/boardedemployees', async(req, res)=>{
  try {
    const employee = await Employee.find({ currentStatus: 'In'})
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

router.get('/deboardedemployees', async(req, res)=>{
  try {
    const employee = await Employee.find({ currentStatus: 'Out'}).populate([
      {path: 'deboardingTypeId', select: 'typeName'}
    ])
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

router.get('/onleaveemployees', async(req, res)=>{
  try {
    const employee = await Employee.find({ leaveStatus: true})
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

router.get('/tydutyemployees', async(req, res)=>{
  try {
    const employee = await Employee.find({ currentStatus: 'TyDuty'})
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

router.get('/hospitalemployees', async(req, res)=>{
  try {
    const employee = await Employee.find({ currentStatus: 'Hospital'})
    res.send(employee)
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
    const employeeLog = await EmployeeMonitoring.deleteMany({employeeId: req.params.id});
    const employee = await Employee.deleteOne({_id:req.params.id})
    res.send(employee)
  } catch (error) {
    res.send(error);
  }
})

router.patch('/updatestatus/:id', async (req, res) => {
  const status = req.body.status;
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    employee.status = status;
    
    await employee.save();

    res.send(employee)
  } catch (error) {
    res.send(error);
  }
})

router.post('/fileupload', multer.single('file'), (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Construct the URL path
    const fileUrl = `/employees/images/${req.file.filename}`;

    res.status(200).send({
      message: 'File uploaded successfully',
      file: req.file,
      fileUrl: fileUrl
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete('/filedelete', async (req, res) => {
  try {
    const fileName = path.basename(req.query.fileName);

    const filePath = path.join(__dirname, '../images', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, async (err) => {
        if (err) {
          return res.status(500).send({ message: 'Error deleting file' });
        }

        res.json({message: "File deleted successfully"}); // Send the response after the file is deleted and database operations are complete
      });
    } else {
      return res.status(404).send({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/bycode/:code', async(req, res)=>{
  try {
    const employee = await Employee.findOne({ employeeCode: req.params.code });
    res.send(employee)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router