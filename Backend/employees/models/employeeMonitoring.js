const mongoose = require('mongoose')

const employeemonitoringSchema = new mongoose.Schema(
    {
        employeeId :{type: mongoose.Schema.ObjectId, required: true, ref: 'Employee'},
        checkInTime : { type: Date},
        checkOutTime : { type: Date, required: true},
        currentStatus : { type: Boolean, required: true, default: true},
        curfewTime : { type: Boolean},
        purpose : { type: mongoose.Schema.ObjectId, required: true, ref: 'DeboardingType'},
        status :{type:Boolean, required:true, default: true},
    }
)


const employeemonitoringModel = mongoose.model('EmployeeMonitoring',employeemonitoringSchema)

module.exports = employeemonitoringModel