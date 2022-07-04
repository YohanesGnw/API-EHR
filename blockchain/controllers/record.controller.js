const conn = require('../bc.connection'),
    methods = conn.contract.methods;

async function create(data) {
    console.log(methods)
    return await methods.create(
        data.patient,
        data.doctor,
        data.disease,
        data.detail,
        data.date
    ).send(conn.hospital.sender);
}

async function read(data) {
    return await methods.read(
        data.patient,
        data.hospital,
        data.disease,
        data.date
    ).call();
}

module.exports = {
    create,
    read
}
