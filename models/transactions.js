const mongoose = require('mongoose')
require('mongoose-double')(mongoose);;
const Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const transactionSchema = new Schema({
    vehicleNo: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


var Transactions = mongoose.model('Transaction', transactionSchema);

module.exports = Transactions;