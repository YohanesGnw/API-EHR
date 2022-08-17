const bdb = require('../bigchaindb/controllers/record.controller'),
    bc = require('../blockchain/controllers/record.controller'),
    handlers = {
        response: require('../handlers/response.handler'
        )
    };

async function create(req, res) {
    const body = req.body

    // Send metadata to Blockchain
    // const response = { bc: await bc.create(body, res) }

    // body.cipher.bc_tx_address = response.bc.receipt.transactionHash
    const response = {}
    body.bc_tx_address = "tx_12345";

    response.bdb = await bdb.create(body, res)

    res.status(200).json(response).end()
}

async function read(req, res) {
    let response = {}
    response = await bdb.read(req.params)

    res.status(200).json(response).end()
}

async function index(req, res) {
    let response = {}
    response = await bdb.index(req.params)

    res.status(200).json(response).end()
}

async function indexbyDisease(req, res) {
    let response = {}
    response = await bdb.indexbyDisease(req.params)

    res.status(200).json(response).end()
}

async function readbyDisease(req, res) {
    let response = {}
    response = await bdb.readbyDisease(req.query)

    res.status(200).json(response).end()
}
module.exports = {
    create,
    read,
    index,
    indexbyDisease,
    readbyDisease
}
