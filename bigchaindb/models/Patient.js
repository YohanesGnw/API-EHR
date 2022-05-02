const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    phone: {
        type: String,
        required: true,
        unique: true
    },
    bc_address: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        unique: true
    },
    ecdh_public_key: {
        type: String,
        required: true,
        unique: true
    },
    ed25519_public_key: {
        type: String,
        required: true,
        unique: true,
    },
    model: {
        type: String,
        default: "Patient"
    }
});

module.exports = mongoose.model("Patient", schema);
