const express = require('express');
const router =express.Router();

const Role = require('../models/role')

router.post('/add', async(req,res)=>{
    const{ roleName, status } = req.body;
    try {
        const role = new Role({ roleName, status })
        await role.save()
        res.send(role)       
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
          roleName: { // Assuming 'roleName' is the field you're searching
            $regex: new RegExp(searchTerm, 'i'), // Create a case-insensitive regex
          },
        }
    }

    try {
        const result = await Role.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await Role.countDocuments(whereClause);
        } else {
            totalCount = await Role.countDocuments();
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
  const {roleName, noOfEmployees, status} = req.body;
  try {
    const role = await Role.findByIdAndUpdate(req.params.id)
    role.roleName = roleName;
    role.noOfEmployees = noOfEmployees;
    role.status = status
    await role.save();
    res.send(role)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const role = await Role.deleteOne({_id:req.params.id})
    res.send(role)
  } catch (error) {
    res.send(error);
  }
})

module.exports = router