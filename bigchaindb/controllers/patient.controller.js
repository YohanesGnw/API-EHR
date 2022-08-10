const bdb = require('../bdb'),
    driver = bdb.driver,
    assets = bdb.assets,
    patient = bdb.patient,
    Patient = require('../models/Patient');

async function create(data, res) {
    const keys = new driver.Ed25519Keypair(),
        patient = new Patient({
            name: data.name,
            email: data.email,
            phone: data.phone,
            bc_address: data.bc_address,
            dob: data.dob,
            gender: data.gender,
            ecdh_public_key: data.ecdh.public_key,
            ed25519_public_key: keys.publicKey,
            iv: data.iv
        }),
        mdb_data = new Patient({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            bc_address: data.bc_address,
            dob: data.dob,
            gender: data.gender,
            ecdh_public_key: data.ecdh.public_key,
            ed25519_public_key: keys.publicKey,
            ed25519_private_key: keys.privateKey,
            iv: data.iv
        })
        
    return {
        mdb: await mdb_data.save(),
        bdb: await bdb.create_tx(patient, null, keys.privateKey, keys.publicKey, res)
    };

}

async function read(data) {
    return await assets.findOne({
        'data.model': "Patient",
        'data.bc_address': data.patient
    });
}

async function login(data) {
    return await patient.findOne({
        'model': "Patient",
        'email': data.email,
        'password': data.password
    });
}

async function update(data) {
    let patient_data = await patient.findOne({
        'model': "Patient",
        'bc_address': data.bc_address
    });

    patient_data.password = data.password
    patient_data.dob = data.dob
    patient_data.gender = data.gender
    patient_data.phone = data.phone

    patient.findOneAndReplace({
        'model': "Patient",
        'bc_address': data.bc_address
    }, patient_data, null, (value) => {});

    return patient_data
}

async function index(data) {
    return assets.find({
        'data.model': "Patient",
    }).toArray();
}

module.exports = {
    create,
    read,
    index,
    login,
    update
}