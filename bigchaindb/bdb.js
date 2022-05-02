const driver = require('bigchaindb-driver'),
    transaction = driver.Transaction,
    conn = new driver.Connection('http://localhost:9984/api/v1/'),
    mongoose = require('mongoose'),
    assets = mongoose.connection.collection('assets'),
    mdb_conn = mongoose.connect('mongodb://localhost:27017/bigchain');

async function create_tx(data, metadata, privateKey, publicKey, res) {
    try {
        // I was trying to make multiple outputs for 1 assets (future works)

        // let tx_conditions = [];
        //
        // for (let i = 0; i < publicKeys.length; i++)
        //     tx_conditions[i] = transaction.makeEd25519Condition(publicKeys[i])

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
        console.log(err);
        res.status(500).json(err).end();
    }
}

module.exports = {
    conn, driver, create_tx, mdb_conn, assets, mongoose
}
