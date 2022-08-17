const {
    all
} = require('express/lib/application');

const bdb = require('../bdb'),
    hospitals = bdb.mongoose.connection.collection('hospitals'),
    controllers = {
        disease: require('../controllers/disease.controller'),
        hospital: require('../controllers/hospital.controller'),
        doctor: require('../controllers/doctor.controller'),
    },
    assets = bdb.assets,
    Record = require("../models/Record");

async function create(data, res) {
    data.hospital = await hospitals.findOne({
        'bc_address': data.bc_addresses.hospital
    })

    let disease = await controllers.disease.readforCreateRecord(data)
    console.log(disease)
    let receipt = {}

    // Create Disease if not exists
    if (disease == null) {
        const response = await controllers.disease.create(data)
        disease = response.asset
    }

    receipt.disease = disease


    // Create Record
    const record = new Record({
        disease_id: disease._id,
        diagnose: data.cipher.diagnose,
        bc_tx_address: data.cipher.bc_tx_address,
        doctor_bc_address: data.bc_addresses.doctor
    })

    const metadata = {
        diagnose: data.metadata.diagnose
    }

    const response = await bdb.create_tx(
        record,
        metadata,
        data.hospital.ed25519_private_key,
        data.hospital.ed25519_public_key,
        res
    )

    receipt.record = response
    return receipt
}

async function index(data) {

    const disease = await controllers.disease.read(data)
    const hospital = await controllers.hospital.read(data)

    const allRecord = []

    const records = await assets.find({
        'data.model': "Record",
        'data.disease_id': disease._id
    }).toArray();

    for (x = 0; x < records.length; x++) {
        const doctor = await controllers.doctor.readforRecord(records[x].data.doctor_bc_address)

        let record = {
            'bc_tx_address': records[x].data.bc_tx_address,
            'date': records[x].data.date,
            'diagnose': records[x].data.diagnose,
            'doctor_bc_address': records[x].data.doctor_bc_address,
            'doctor': doctor.data,
            'metadata': records[x].id,
        }
        allRecord.push(record)
    }

    return {
        'disease': disease,
        'hospital': hospital.data,
        'records': allRecord
    };
}

async function indexbyDisease(data) {
    const disease = await controllers.disease.indexbyDisease({
        patient: {
            bc_address: data.patient
        },
        disease: {
            name: data.disease
        }
    })

    let datas = []

    for (x = 0; x < disease.length; x++) {
        let records = await getRecord(disease[x]);
        for (i = 0; i < records.length; ++i) {
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

    const disease = await controllers.disease.read(data)

    console.log(disease)
    return bdb.assets.findOne({
        'data.model': "Record",
        'data.disease_id': disease._id,
        'data.date': data.date
    });
}

async function readbyDisease(data) {

    allRecord = [];
    if (typeof data.diseases === 'string') {
        const records = await assets.find({
            'data.model': "Record",
            'data.disease_id': data.diseases
        }).toArray();

        for (x = 0; x < records.length; x++) {
            const doctor = await controllers.doctor.readforRecord(records[x].data.doctor_bc_address)

            let record = {
                'bc_tx_address': records[x].data.bc_tx_address,
                'date': records[x].data.date,
                'disease_id': records[x].data.disease_id,
                'diagnose': records[x].data.diagnose,
                'doctor_bc_address': records[x].data.doctor_bc_address,
                'doctor': doctor.data,
                'metadata': records[x].id,
            }
            allRecord.push(record)
        }
    } else {
        for (a = 0; a < data.diseases.length; a++) {
            console.log(data.diseases[a])
            const records = await assets.find({
                'data.model': "Record",
                'data.disease_id': data.diseases[a]
            }).toArray();

            for (x = 0; x < records.length; x++) {
                const doctor = await controllers.doctor.readforRecord(records[x].data.doctor_bc_address)

                let record = {
                    'bc_tx_address': records[x].data.bc_tx_address,
                    'date': records[x].data.date,
                    'disease_id': records[x].data.disease_id,
                    'diagnose': records[x].data.diagnose,
                    'doctor': doctor.data,
                    'metadata': records[x].id,
                }
                allRecord.push(record)
            }
        }
    }

    return allRecord;
}

// const disease = await controllers.disease.readforRecord({
//     bc_addresses: {patient: data.patient,
//         hospital: data.hospital},
//     cipher: {disease: data.disease}
// })

module.exports = {
    create,
    index,
    read,
    indexbyDisease,
    readbyDisease
}