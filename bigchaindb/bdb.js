const driver = require('bigchaindb-driver'),
    transaction = driver.Transaction,
    conn = new driver.Connection('http://localhost:9984/api/v1/'),
    mongoose = require('mongoose'),
    assets = mongoose.connection.collection('assets'),
    hospital = mongoose.connection.collection('hospitals'),
    mdb_conn = mongoose.connect('mongodb://localhost:27017/bigchain');

async function create_tx(data, metadata, privateKey, publicKey, res) {
    try {
        const tx = transaction.makeCreateTransaction(
            data,
            metadata,

            // A transaction needs an output
            [transaction.makeOutput(
                transaction.makeEd25519Condition(publicKey))
            ],
            publicKey
        )

        const txSigned = transaction.signTransaction(tx, privateKey)

        return await conn.postTransactionCommit(txSigned) // Return transaction receipt
    } catch (err) {
        
        res.status(500).json(err).end();
    }
}

module.exports = {
    conn, driver, create_tx, mdb_conn, assets, mongoose, hospital
}
