const mongoose = require('mongoose')

const shipemployeeSchema = new mongoose.Schema(
    {
        shipId : {type: mongoose.Schema.Types.ObjectId, ref: 'Ship'},
        employeeId : {type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
        startingDate : {type: Date},
        endingDate : {type: Date},
        status : {type: Boolean}
    }
)


const shipemployeeModel = mongoose.model('ShipEmployee',shipemployeeSchema)

module.exports = shipemployeeModel