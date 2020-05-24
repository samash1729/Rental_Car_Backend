const mongoose = require('mongoose')
require('mongoose-double')(mongoose);;
const Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const carSchema = new Schema({
    vehicleNo: {
        type: String,
        required: true,
        unique: true
    },
    carName: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    seatingCap: {
        type: String,
        required: true,
        min: 1
    },
    color:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: SchemaTypes.Double,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});


var Cars = mongoose.model('Car', carSchema);

module.exports = Cars;