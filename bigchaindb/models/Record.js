const mongoose = require("mongoose");

const schema = new mongoose.Schema({
        disease_id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        diagnose: {
            type: String,
            required: true
        },
        bc_tx_address: {
            type: String,
            required: true,
            unique: true
        },
        doctor_bc_address: {
            type: String,
            required: true,
            unique: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        model: {
            type: String,
            default: "Record"
        }
    }, {timestamps: true}
);

module.exports = mongoose.model("Record", schema);
