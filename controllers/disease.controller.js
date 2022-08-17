const bdb = require('../bigchaindb/controllers/disease.controller'),
    bc = require('../blockchain/controllers/disease.controller')

async function read(req, res) {
    let response = {}
    response = await bdb.read(req.params)

    res.status(200).json(response).end()
}

async function index(req, res) {
    let response = {}
    response = await bdb.index(req.params, req.body)

    res.status(200).json(response).end()
}

async function indexbyHospital(req, res) {
    let response = {}
    response = await bdb.indexbyHospital(req.params)

    res.status(200).json(response).end()
}

module.exports = {
    index,
    read,
    indexbyHospital
}