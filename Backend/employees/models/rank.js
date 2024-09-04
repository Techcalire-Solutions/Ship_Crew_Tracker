const mongoose = require('mongoose')

const rankSchema = new mongoose.Schema(
    {
        rankName :{type:String, required:true},
        status :{type:Boolean, required:true, default: true},
    }
)


const rankModel = mongoose.model('Rank',rankSchema)

module.exports = rankModel