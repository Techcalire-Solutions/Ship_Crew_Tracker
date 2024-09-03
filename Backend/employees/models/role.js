const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema(
    {
        roleName :{type:String, required:true},
        status :{type:Boolean, required:true, default: true},
    }
)


const roleModel = mongoose.model('Role',roleSchema)

module.exports = roleModel