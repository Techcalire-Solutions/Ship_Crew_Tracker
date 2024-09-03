const express = require('express');
const router =express.Router();

const Ship = require('../models/ship')

router.post('/add', async(req,res)=>{
    const{ shipName, noOfEmployees, status, shipCode } = req.body;
    try {
        const ship = new Ship({ shipName, noOfEmployees, status, shipCode })
        await ship.save()
        res.send(ship)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/findbyid/:id', async(req, res)=>{
  try {
      const ship = await Ship.findById(req.params.id);
      res.send(ship)
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
    }

    if (req.query.search && req.query.search != 'undefined') {
        const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
        whereClause = {
          shipName: { // Assuming 'shipName' is the field you're searching
            $regex: new RegExp(searchTerm, 'i'), // Create a case-insensitive regex
          },
        }
    }

    try {
        const result = await Ship.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await Ship.countDocuments(whereClause);
        } else {
            totalCount = await Ship.countDocuments();
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
  const {shipName, noOfEmployees, status, shipCode} = req.body;
  try {
    const ship = await Ship.findByIdAndUpdate(req.params.id)
    ship.shipName = shipName;
    ship.noOfEmployees = noOfEmployees;
    ship.shipCode = shipCode
    ship.status = status
    await ship.save();
    res.send(ship)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const ship = await Ship.deleteOne({_id:req.params.id})
    res.send(ship)
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