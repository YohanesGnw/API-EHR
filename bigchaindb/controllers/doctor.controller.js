const bdb = require('../bdb'),
    hospitals = bdb.mongoose.connection.collection('hospitals'),
    doctors = bdb.mongoose.connection.collection('doctors'),
    assets = bdb.assets,
    driver = bdb.driver,
    model = require('../models/Doctor');;

async function create(data, res) {
    const keys = new driver.Ed25519Keypair(),

    doctor = new model({
        name: data.name,
        bc_address: data.bc_address,
        email: data.email,
        hospital: data.hospital,
        dob: data.dob,
        speciality: data.speciality
    }),
    mdb_data = new model({
        name: data.name,
        bc_address: data.bc_address,
        email: data.email,
        password: data.password,
        hospital: data.hospital,
        dob: data.dob,
        speciality: data.speciality
    })

    return {
        mdb: await mdb_data.save(),
        bdb: await bdb.create_tx(doctor, null, keys.privateKey, keys.publicKey, res)
    };
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
    
    const doctor = await doctors.findOne({
        'email': data.email,
        'password': data.password
    })
    const hospital = await hospitals.findOne({
        'email': data.email,
        'password': data.password
    })

    if (doctor != null) {
        return doctor;
    } 
    else{
        return hospital;
    }
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