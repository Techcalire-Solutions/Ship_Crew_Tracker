const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema(
    {
        name : {type:String, required:true},
        employeeCode : {type:String, required:true},
        deboardingTypeId : { type: mongoose.Schema.Types.ObjectId, ref: 'DeboardingType', required: false},
        leaveStatus : {type: Boolean, default: false},
        status : {type: Boolean, required:true, default: true},
        roleId : { type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
        phoneNumber : { type: String, required:true},
        email : { type: String},
        joiningDate : { type: Date, required:true},
        rankId : {type: mongoose.Schema.Types.ObjectId, ref: 'Rank'},
        departmentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: false},
        address : { type: String},
    }
)

const employeeModel = mongoose.model('Employee', employeeSchema)

module.exports = employeeModel