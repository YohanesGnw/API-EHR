const bdb = require('../bdb'),
    driver = bdb.driver,
    assets = bdb.assets,
    Patient = require('../models/Patient');

async function create(data, res) {
    const keys = new driver.Ed25519Keypair(),
        patient = new Patient({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            bc_address: data.bc_address,
            dob: data.dob,
            gender: data.gender,
            ecdh_public_key: data.ecdh.public_key,
            ed25519_public_key: keys.publicKey
        });

    return bdb.create_tx(
        patient,
        null,
        keys.privateKey,
        keys.publicKey,
        res
    );
}

async function read(data) {
    return await assets.findOne({
        'data.model': "Patient",
        'data.bc_address': data.patient
    });
}

async function index(data) {
    return assets.find({
        'data.model': "Patient",
    }).toArray();
}


module.exports = {
    create, read, index
}