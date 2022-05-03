const bdb = require('../bigchaindb/controllers/disease.controller'),
    bc = require('../blockchain/controllers/disease.controller')

async function index(req, res) {
    let response = {}
    response.bdb = await bdb.index(req.params)
    console.log("response:", response)

    res.status(200).json(response).end()
}

async function indexbyHospital(req, res) {
    let response = {}
    response.bdb = await bdb.indexbyHospital(req.params)
    console.log("response:", response)

    res.status(200).json(response).end()
}

module.exports = {
    index, indexbyHospital
}
