const bdb = require('../bdb'),
    assets = bdb.assets,
    Disease = require('../models/Disease');
    
async function create(data) {
    const disease = new Disease({
        patient_bc_address: data.bc_addresses.patient,
        hospital_bc_address: data.bc_addresses.hospital,
        name: data.cipher.disease
    })

    const metadata = {
        disease: data.metadata.disease
    }

    return bdb.create_tx(
        disease,
        metadata,
        data.hospital.ed25519_private_key,
        data.hospital.ed25519_public_key
    )
}

async function readforRecord(data) {
    return await assets.findOne({
        'data.model': "Disease",
        'data.patient_bc_address': data.bc_addresses.patient,
        'data.hospital_bc_address': data.bc_addresses.hospital,
        'data.name': data.cipher.disease
    });

}

async function read(data) {
    let disease = await assets.findOne({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient,
        'data.hospital_bc_address': data.hospital,
        'data.name': data.disease
    });
    
    let diseaseData = {
        'patient_bc_address': disease.data.patient_bc_address,
        'hospital_bc_address': disease.data.hospital_bc_address,
        'name': disease.data.name,
        '_id': disease.data._id,
        'metadata': disease.id
    }
    return diseaseData
}

async function readforCreateRecord(data) {
    let disease = await assets.findOne({
        'data.model': "Disease",
        'data.patient_bc_address': data.bc_addresses.patient,
        'data.hospital_bc_address': data.bc_addresses.hospital,
        'data.name': data.cipher.disease
    });

    if (disease === null) {
        return disease
    } else {
        let diseaseData = {
            'patient_bc_address': disease.data.patient_bc_address,
            'hospital_bc_address': disease.data.hospital_bc_address,
            'name': disease.data.name,
            '_id': disease.data._id,
            'metadata': disease.id
        }
        return diseaseData
    }
}

async function index(data, body) {

    let res = []
    if (Object.keys(body).length === 0) {
        let disease = await assets.find({
            'data.model': "Disease",
            'data.patient_bc_address': data.patient
        }).toArray();

        let hospitalMap = {};
        // can't use index function from hospital controller
        let list_hospital = await assets.find({
            'data.model': "Hospital"
        }).toArray();

        for (let i = 0; i < disease.length; ++i) {
            if (!hospitalMap[disease[i].data.hospital_bc_address]) {
                hospitalMap[disease[i].data.hospital_bc_address] = [];
            }

            hospitalMap[disease[i].data.hospital_bc_address].push({
                'name': disease[i].data.name,
                '_id': disease[i].data._id,
                'date': disease[i].data.date,
                'encrypted': true
            });
        }

        for (const [key, value] of Object.entries(hospitalMap)) {
            let curHospital;
            // can change to hit bdb every hospital
            for (let i = 0; i < list_hospital.length; ++i) {
                if (list_hospital[i].data.bc_address == key)
                    curHospital = list_hospital[i].data
            }
            res.push({
                "hospital": curHospital,
                "diseases": value
            });
        }
    } else {
        let disease = await assets.find({
            'data.model': "Disease",
            'data.patient_bc_address': data.patient
        }).toArray();

        let hospitalMap = {};
        // can't use index function from hospital controller
        let list_hospital = await assets.find({
            'data.model': "Hospital"
        }).toArray();

        for (let i = 0; i < disease.length; ++i) {
            if (body.hospitals.includes(disease[i].data.hospital_bc_address)) {
                if (!hospitalMap[disease[i].data.hospital_bc_address]) {
                    hospitalMap[disease[i].data.hospital_bc_address] = [];
                }

                hospitalMap[disease[i].data.hospital_bc_address].push({
                    'name': disease[i].data.name,
                    '_id': disease[i].data._id,
                    'date': disease[i].data.date,
                    'encrypted': true
                });
            }
        }
        
        for (const [key, value] of Object.entries(hospitalMap)) {
            let curHospital;
            // can change to hit bdb every hospital
            for (let i = 0; i < list_hospital.length; ++i) {
                if (list_hospital[i].data.bc_address == key)
                    curHospital = list_hospital[i].data
            }
            res.push({
                "hospital": curHospital,
                "diseases": value
            });
        }
    }
    return res;
}

async function indexbyPatient(data) {
    return await assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient.bc_address
    }).toArray();
}

async function indexbyHospital(data) {
    let datas = []
    let disease = await assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient,
        'data.hospital_bc_address': data.hospital,
    }).toArray();

    for (let i = 0; i < disease.length; i++) {
        let diseaseData = {
            'name': disease[i].data.name,
            '_id': disease[i].data._id,
            'metadata': disease[i].id
        }
        datas.push(diseaseData)
    }

    return datas;
}

function indexbyDisease(data) {
    return assets.find({
        'data.model': "Disease",
        'data.patient_bc_address': data.patient.bc_address,
        'data.name': data.disease.name
    }).toArray()
}

module.exports = {
    create,
    readforRecord,
    read,
    index,
    indexbyHospital,
    indexbyPatient,
    indexbyDisease,
    readforCreateRecord
}