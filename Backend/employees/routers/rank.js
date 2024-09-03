const express = require('express');
const router =express.Router();

const Rank = require('../models/rank')

router.post('/add', async(req,res)=>{
    const{ rankName, status } = req.body;
    try {
        const rank = new Rank({ rankName, status })
        await rank.save()
        res.send(rank)       
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
          rankName: { // Assuming 'rankName' is the field you're searching
            $regex: new RegExp(searchTerm, 'i'), // Create a case-insensitive regex
          },
        }
    }

    try {
        const result = await Rank.find(whereClause).skip(offset).limit(limit).sort({_id: -1})

        if (req.query.search) {
            totalCount = await Rank.countDocuments(whereClause);
        } else {
            totalCount = await Rank.countDocuments();
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
  const {rankName, noOfEmployees, status} = req.body;
  try {
    const rank = await Rank.findByIdAndUpdate(req.params.id)
    rank.rankName = rankName;
    rank.noOfEmployees = noOfEmployees;
    rank.status = status
    await rank.save();
    res.send(rank)
  } catch (error) {
    res.send(error);
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const rank = await Rank.deleteOne({_id:req.params.id})
    res.send(rank)
  } catch (error) {
    res.send(error);
  }
})

module.exports = router