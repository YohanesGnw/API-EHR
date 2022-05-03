const bdb = require('../bigchaindb/controllers/doctor.controller'),
    bc = require('../blockchain/controllers/doctor.controller')

async function create(req, res) {
    const body = req.body

    // bc.create()

    const response = await bdb.create(body, res)

    res.status(200).json(response).end();
}

async function read(req, res) {
    let response = {}
    response.bdb = await bdb.read(req.params)

    res.status(200).json(response).end()
}

async function index(req, res) {
    let response = {}
    response.bdb = await bdb.index(req.params)
    console.log("response:", response)

    res.status(200).json(response).end()
}

module.exports = {
    create, read, index
}
