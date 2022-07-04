const bdb = require('../bigchaindb/controllers/hospital.controller'),
    bc = require('../blockchain/controllers/hospital.controller');

async function create(req, res) {
    const body = req.body

    // await bc.create(body.blockchain, res)

    // body.bdb.bc_tx_address =
    const response = await bdb.create(body, res);
    res.status(200).json(response);
}

async function read(req, res) {
    let response = {}
    response = await bdb.read(req.params)

    res.status(200).json(response.data).end()
}

async function readLocal(req, res) {
    let response = {}
    response = await bdb.readLocal(req.params)
    res.status(200).json(response).end()
}

async function getAll(req, res) {
    let response = {}
    response = await bdb.getAll()

    //bersihin
    response = response.map(function All(params) {
        return params.data
    })
    console.log(response)
    res.status(200).json(response).end()
}

async function index(req, res) {
    let response = {}
    response = await bdb.index(req.params)

    res.status(200).json(response).end()
}

module.exports = {
    create,
    read,
    index,
    readLocal,
    getAll
}
