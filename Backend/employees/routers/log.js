const express = require('express');
const router =express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

router.get('/getlog', async (req, res) => {
    try {
        const logs = await prisma.deviceLogs_Processed.findMany({
            select: {
              DeviceLogId: true, // Select the id field
              DownloadDate: true,
              UserId: true // Select the timestamp field for when the log was created
            },
            orderBy: {
              DownloadDate: 'desc', // Order by the creation date, newest first
            },
          });
          res.send(logs)
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/lastentry/:code', async (req, res) => {
  try {
    // Introduce a delay before proceeding (e.g., 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000)); // 2000 milliseconds = 2 seconds

    const lastLog = await prisma.deviceLogs_Processed.findMany({
      select: {
        DeviceLogId: true,
        DownloadDate: true,
        UserId: true
      },
      orderBy: {
        DownloadDate: 'desc',
      }
    });

    if (lastLog[0] && lastLog[0].UserId === req.params.code) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});




module.exports = router