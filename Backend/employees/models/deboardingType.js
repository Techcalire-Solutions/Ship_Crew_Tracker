const mongoose = require('mongoose')

const deboardingTypeSchema = new mongoose.Schema(
    {
        typeName : {type:String, required:true},
        description : {type:String},
        curfewTime : {type:String, required:true},
        status :{type:Boolean, required:true, default: true},
    }
)


const deboardingTypeModel = mongoose.model('DeboardingType', deboardingTypeSchema)

module.exports = deboardingTypeModel