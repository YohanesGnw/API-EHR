const mongoose = require("mongoose");

const schema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        bc_address: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        hospital: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        speciality: {
            type: String,
            required: true
        },
        model: {
            type: String,
            default: "Doctor"
        }
    },
    //buat kasih tau kapan data docter ini masuk
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Doctor", schema);