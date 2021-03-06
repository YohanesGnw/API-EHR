const bdb = require('../bdb'),
    driver = bdb.driver,
    assets = bdb.assets,
    hospital = bdb.hospital,
    controllers = {
        disease: require('../controllers/disease.controller')
    },
    model = require('../models/Hospital');

async function create(data, res) {
    // Create objects
    const keys = new driver.Ed25519Keypair(),
        hospital = new model({
            name: data.name,
            bc_address: data.bc_address,
            email: data.email,
            address: data.address,
            phone: data.phone,
            ecdh_public_key: data.ecdh_public_key,
            ed25519_public_key: keys.publicKey,
            model: "Hospital"
        }),
        mdb_data = new model({
            name: data.name,
            bc_address: data.bc_address,
            email: data.email,
            address: data.address,
            phone: data.phone,
            password: data.password,
            ecdh_public_key: data.ecdh_public_key,
            ecdh_private_key: data.ecdh_private_key,
            ed25519_public_key: keys.publicKey,
            ed25519_private_key: keys.privateKey,
        })

    return {
        mdb: await mdb_data.save(),
        bdb: await bdb.create_tx(hospital, null, keys.privateKey, keys.publicKey, res)
    };
}

async function login(data) {
    return await hospital.findOne({
        'model': "Hospital",
        'email': data.email,
        'password': data.password
    });
}

async function read(data) {
    return await assets.findOne({
        'data.model': "Hospital",
        'data.bc_address': data.hospital
    });
}

async function readLocal(data) {
    return await hospital.findOne({
        'bc_address': data.hospital
    });
}

async function getAll() {
    return await assets.find({
        'data.model': "Hospital"
    }).toArray();
}

async function index(data) {

    const disease = await controllers.disease.indexbyPatient({
        patient: {
            bc_address: data.patient
        }
    })
    let datas = new Set();
    for (x = 0; x < disease.length; x++) {
        let hospitals = await getHospital(disease[x]);
        for(i = 0; i < hospitals.length; ++i) {
            datas.add(hospitals[i].data.name);
        };
    }
    return Array.from(datas);
}

async function getHospital(disease) {
    return await assets.find({
        'data.model': "Hospital",
        'data.bc_address': disease.data.hospital_bc_address
    }).toArray();
}

module.exports = {
    create,
    read,
    index,
    readLocal,
    getAll,
    login
}