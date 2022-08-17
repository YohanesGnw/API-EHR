const conn = require('../bc.connection'),
    abi = conn.web3.eth.abi,
    contract = conn.contract,
    methods = contract.methods;

async function create(data) {
    sender = conn.hospital.sender
    sender.from = data.bc_addresses.hospital

    const status = 201
    const receipt = await methods.create(
        data.bc_addresses.patient,
        data.bc_addresses.doctor,
        data.metadata.disease,
        data.metadata.diagnose,
        data.date
    ).send(sender);

    return { status, receipt }
}

async function read(data) {
    const create_params = contract.abi[0].inputs,
        tx = await conn.web3.eth.getTransaction(data.tx)

    return await abi.decodeParameters(create_params, tx.input.slice(10))
}

module.exports = {
    create,
    read
}

