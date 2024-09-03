const mongoose = require('mongoose')

const shipSchema = new mongoose.Schema(
    {
        shipName :{type:String, required:true},
        shipCode :{type:String, required:true},
        noOfEmployees :{type:Number, required:true},
        status :{type:Boolean, required:true, default: true},
    }
)


const shipModel = mongoose.model('Ship',shipSchema)

module.exports = shipModel