const { response } = require('express');
const bdb = require('../bigchaindb/controllers/patient.controller'),
    bc = require('../blockchain/controllers/patient.controller')

async function create(req, res) {
    const body = req.body

    // bc.create()

    const response = await bdb.create(body, res)

    res.status(200).json(response).end();
}

async function read(req, res) {
    let response = {}
    response = await bdb.read(req.params)

    res.status(200).json(response.data).end()
}

async function login(req, res) {
    let response = {}
    response = await bdb.login(req.query)

    res.status(200).json(response).end()
}

async function update(req, res) {
    let response = {}
    response = await bdb.update(req.body)

    res.status(200).json(response).end()
}

async function index(req, res) {
    let response = {}
    response = await bdb.index(req.params)
    console.log("response:", response)

    res.status(200).json(response).end()
}


module.exports = {
    create, read, index, login, update
}
