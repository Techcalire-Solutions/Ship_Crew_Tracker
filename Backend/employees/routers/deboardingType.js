const express = require('express');
const router =express.Router();

const DeboardingType = require('../models/deboardingType')

router.post('/add', async(req,res)=>{
    const{ typeName, description, curfewTime, status } = req.body;
    try {
        const deboardingtype = new DeboardingType({ typeName, description, curfewTime, status })
        await deboardingtype.save()
        res.send(deboardingtype)       
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
          typeName: { // Assuming 'deboardingtypeName' is the field you're searching
            $regex: new RegExp(searchTerm, 'i'), // Create a case-insensitive regex
          },
        }
    }

    try {
        const result = await DeboardingType.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await DeboardingType.countDocuments(whereClause);
        } else {
            totalCount = await DeboardingType.countDocuments();
        }

        if (req.query.page && req.query.pageSize && req.query.page != 'undefined' && req.query.pageSize != 'undefined' ) {
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
  const { typeName, description, curfewTime, status } = req.body;
  try {
    const deboardingtype = await DeboardingType.findByIdAndUpdate(req.params.id)
    deboardingtype.typeName = typeName;
    deboardingtype.description = description;
    deboardingtype.status = status;
    deboardingtype.curfewTime = curfewTime;
    await deboardingtype.save();
    res.send(deboardingtype)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const deboardingtype = await DeboardingType.deleteOne({_id:req.params.id})
    res.send(deboardingtype)
  } catch (error) {
    res.send(error);
  }
})

module.exports = router