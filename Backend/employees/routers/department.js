const express = require('express');
const router =express.Router();

const Department = require('../models/department')

router.post('/add', async(req,res)=>{
    const{ departmentName, status } = req.body;
    try {
        const department = new Department({ departmentName, status })
        await department.save()
        res.send(department)       
    } catch (error) {
       return  res.send(error)       
    }
})


   
router.get('/findall', async(req, res)=>{
    let whereClause = {}
    let limit;
    let offset;
    if (req.query.pageSize && req.query.pageSize != 'undefined'  && req.query.page && req.query.page != 'undefined' ) {
        limit = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
    }
    
    if (req.query.search && req.query.search != 'undefined') {
        const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
        whereClause = {
          departmentName: { // Assuming 'departmentName' is the field you're searching
            $regex: new RegExp(searchTerm, 'i'), // Create a case-insensitive regex
          },
        }
    }

    try {
        const result = await Department.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await Department.countDocuments(whereClause);
        } else {
            totalCount = await Department.countDocuments();
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
  const {departmentName, noOfEmployees, status} = req.body;
  try {
    const department = await Department.findByIdAndUpdate(req.params.id)
    department.departmentName = departmentName;
    department.noOfEmployees = noOfEmployees;
    department.status = status
    await department.save();
    res.send(department)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const department = await Department.deleteOne({_id:req.params.id})
    res.send(department)
  } catch (error) {
    res.send(error);
  }
})

module.exports = router