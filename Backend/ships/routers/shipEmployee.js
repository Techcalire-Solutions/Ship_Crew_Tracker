const express = require('express');
const router =express.Router();

const ShipEmployee = require('../models/shipEmployees')

router.post('/add', async(req,res)=>{
    const{ shipId, employeeId, startingDate, endingDate, status } = req.body;
    try {
        const employee = await ShipEmployee.findOne({ employeeId: employeeId, status: true})
        if (employee) {
          return res.send("Selected employee is already assigned")
        }
        const ship = new ShipEmployee({ shipId, employeeId, startingDate, endingDate, status })
        await ship.save()
        res.send(ship)       
    } catch (error) {
       return  res.send(error)       
    }
})

router.get('/findallbyship', async(req, res)=>{
  let whereClause = {
    shipId: req.query.id
  }
  let limit;
  let offset;
  if (req.query.pageSize && req.query.pageSize != 'undefined'  && req.query.page && req.query.page != 'undefined' ) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
  }else{
    whereClause = {
      ...whereClause,
      status: true
    }
  }

  if (req.query.search && req.query.search != 'undefined') {
      const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
      whereClause = {
        ...whereClause,
        shipName: { 
          $regex: new RegExp(searchTerm, 'i'),
        },
      }
  }

  try {
      const result = await ShipEmployee.find(whereClause).skip(offset).limit(limit).sort({_id: -1}).populate(
        { path: 'employeeId', select: 'name' }
      ) 

      if (req.query.search) {
          totalCount = await ShipEmployee.countDocuments(whereClause);
      } else {
          totalCount = await ShipEmployee.countDocuments();
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
        const result = await ShipEmployee.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await ShipEmployee.countDocuments(whereClause);
        } else {
            totalCount = await ShipEmployee.countDocuments();
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
  const {shipId, employeeId, startingDate, endingDate, status} = req.body;
  try {
    const ship = await ShipEmployee.findByIdAndUpdate(req.params.id)
    ship.shipId = shipId;
    ship.employeeId = employeeId;
    ship.startingDate = startingDate;
    ship.endingDate = endingDate;
    ship.status = status
    await ship.save();
    res.send(ship)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const ship = await ShipEmployee.deleteOne({_id:req.params.id})
    res.send(ship)
  } catch (error) {
    res.send(error);
  }
})

router.patch('/updatestatus/:id', async (req, res) => {
  const status = req.body.status;
  try {
    const result = await ShipEmployee.findById(req.params.id);
    result.status = status;
    await result.save();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
})

module.exports = router