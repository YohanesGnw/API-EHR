const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    patient_bc_address: {
        type: String,
        required: true
    },
    hospital_bc_address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    },
    model: {
        type: String,
        default: "Disease"
    }
});

module.exports = mongoose.model("Disease", schema);
