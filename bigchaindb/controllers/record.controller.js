const bdb = require('../bdb'),
    hospitals = bdb.mongoose.connection.collection('hospitals'),
    controllers = {disease: require('../controllers/disease.controller')},
    assets = bdb.assets,
    Record = require("../models/Record");

async function create(data, res) {
    data.hospital = await hospitals.findOne({
        'bc_address': data.hospital.bc_address
    })

    let disease = await controllers.disease.read(data)
    let receipt = {}

    // Create Disease if not exists
    if (disease == null) {
        const response = await controllers.disease.create(data)
        disease = response.asset
    }

    receipt.disease = disease

    // Create Record
    const record = new Record({
        disease_id: disease.data._id,
        diagnose: data.diagnose,
        bc_tx_address: data.bc_tx_address
    })

    const response = await bdb.create_tx(
        record,
        null,
        data.hospital.ed25519_private_key,
        data.hospital.ed25519_public_key,
        res
    )

    receipt.record = response.asset.data
    return receipt
}

async function index(data) {
    const disease = await controllers.disease.read({
        patient: {bc_address: data.patient},
        hospital: {bc_address: data.hospital},
        disease: {name: data.disease}
    })

    return bdb.assets.find({
        'data.model': "Record",
        'data.disease_id': disease.data._id
    }).toArray();
}

async function indexbyDisease(data) {
    const disease = await controllers.disease.indexbyDisease({
        patient: {bc_address: data.patient},
        disease: {name: data.disease}
    })

    let datas = []

    for (x = 0; x < disease.length; x++) {
        let records = await getRecord(disease[x]);
        for(i = 0; i < records.length; ++i) {
            datas.push(records[i].data);
        };
    }
    
    return datas
}

async function getRecord(disease) {
    return await assets.find({
        'data.model': "Record",
        'data.disease_id': disease.data._id
    }).toArray();
}

async function read(data) {

    const disease = await controllers.disease.read({
        patient: {bc_address: data.patient},
        hospital: {bc_address: data.hospital},
        disease: {name: data.disease},
    })

    return bdb.assets.findOne({
        'data.model': "Record",
        'data.disease_id': disease.data._id,
        'data.date': data.date
    });
}



module.exports = {
    create,
    index,
    read,
    indexbyDisease
}
