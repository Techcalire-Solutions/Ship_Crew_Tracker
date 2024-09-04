const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
    {
        departmentName :{type:String, required:true},
        status :{type:Boolean, required:true, default: true},
    }
)


const departmentModel = mongoose.model('Department',departmentSchema)

module.exports = departmentModel