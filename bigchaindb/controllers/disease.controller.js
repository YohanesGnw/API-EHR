const bdb = require('../bdb'),
    assets = bdb.assets,
    Disease = require('../models/Disease');

async function create(data) {
    const disease = new Disease({
        patient_bc_address: data.patient.bc_address,
        hospital_bc_address: data.hospital.bc_address,
        name: data.disease.name
    })

    return bdb.create_tx(
        disease,
        null,
        data.hospital.ed25519_private_key,
        data.hospital.ed25519_public_key
    )
}

async function read(data) {
    return await assets.findOne({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient.bc_address,
        'data.hospital_bc_address': data.hospital.bc_address,
        'data.name': data.disease.name
    });
}

function index(data) {
    return assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient
    }).toArray()
}

async function indexbyPatient(data) {
    return await assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient.bc_address
    }).toArray();
}

function indexbyHospital(data) {
    return assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient,
        'data.hospital_bc_address': data.hospital,
    }).toArray()
}

function indexbyDisease(data) {
    return assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient.bc_address,
        'data.name': data.disease.name
    }).toArray()
}

module.exports = {
    create, read, index, indexbyHospital, indexbyPatient, indexbyDisease
}
