const bdb = require('../bdb'),
    driver = bdb.driver,
    assets = bdb.assets,
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

async function read(data) {
    return await assets.findOne({
        'data.model': "Hospital",
        'data.bc_address': data.hospital
    });
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
    }).toArray()
}

module.exports = {
    create,
    read,
    index
}