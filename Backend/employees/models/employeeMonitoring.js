const mongoose = require('mongoose')

const employeemonitoringSchema = new mongoose.Schema(
    {
        employeeId :{type: mongoose.Schema.ObjectId, required: true},
        checkInTime : { type: Date},
        checkOutTime : { type: Date, required: true},
        currentStatus : { type: Boolean, required: true, default: true},
        curfewTime : { type: Boolean},
        purpose : { type: String, required: true},
        status :{type:Boolean, required:true, default: true},
    }
)


const employeemonitoringModel = mongoose.model('EmployeeMonitoring',employeemonitoringSchema)

module.exports = employeemonitoringModel