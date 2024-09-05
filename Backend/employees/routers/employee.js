const express = require('express');
const router =express.Router();
const path = require('path');
const fs = require('fs');

const Employee = require('../models/employee');
const multer = require('../../utils/multer');

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
  console.log(status);
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).send({ error: 'Employee not found' });
    }

    employee.status = status;
    console.log(employee);
    
    await employee.save();
    console.log(employee);

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
    console.error('Error uploading file:', error);
    res.status(500).send({ message: error.message });
  }
});

router.delete('/filedelete', async (req, res) => {
  try {
    console.log(req.query);
    const fileName = path.basename(req.query.fileName);

    console.log(fileName);
    const filePath = path.join(__dirname, '../images', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).send({ message: 'Error deleting file' });
        }

        res.json({message: "File deleted successfully"}); // Send the response after the file is deleted and database operations are complete
      });
    } else {
      return res.status(404).send({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(error.message);
  }
});


module.exports = router