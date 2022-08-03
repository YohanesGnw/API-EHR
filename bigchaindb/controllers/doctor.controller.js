const bdb = require('../bdb'),
    hospitals = bdb.mongoose.connection.collection('hospitals'),
    assets = bdb.assets,
    Doctor = require('../models/Doctor');

async function create(data, res) {
    const hospital = await hospitals.findOne()
    const doctor = new Doctor({
        name: data.name,
        bc_address: data.bc_address,
        email: data.email,
        password: data.password,
        hospital: data.hospital,
        dob: data.dob,
    })

    return bdb.create_tx(
        doctor,
        null,
        hospital.ed25519_private_key,
        hospital.ed25519_public_key,
        res
    )
}

async function read(data) {
    return await assets.findOne({
        'data.model': "Doctor",
        'data.bc_address': data.doctor
    });
}

async function readforRecord(data) {
    return await assets.findOne({
        'data.model': "Doctor",
        'data.bc_address': data
    });
}

async function login(data) {
    return await assets.findOne({
        'data.model': "Doctor",
        'data.email': data.email,
        'data.password': data.password
    });
}

async function readforHospital(data) {
    return assets.find({
        'data.model': "Doctor",
        'data.hospital': data.hospital
    }).toArray();
}

async function index(data) {
    return assets.find({
        'data.model': "Doctor",
    }).toArray();
}

module.exports = {
    create, read, index, login, readforRecord, readforHospital
}