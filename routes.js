'use strict';
const patient = require('./controllers/patient.controller'),
    hospital = require('./controllers/hospital.controller'),
    record = require('./controllers/record.controller'),
    disease = require('./controllers/disease.controller'),
    doctor = require('./controllers/doctor.controller')

module.exports = (route) => {
    // Default route redirects to patients
    route.get('', (req, res) => res.redirect('/patients'))

    // Routing for Patient CRUD functions
    route.get('/patients', (req, res) => patient.index(req, res))
    route.get('/patients/login', (req, res) => patient.login(req, res))
    route.get('/patients/update', (req, res) => patient.update(req, res))
    route.get('/patients/:patient', (req, res) => patient.read(req, res))
    route.post('/patients', (req, res) => patient.create(req, res))

    // Routing for Doctor CRUD functions
    route.get('/doctors', (req, res) => doctor.index(req, res))
    route.get('/doctors/login', (req, res) => doctor.login(req, res))
    route.get('/doctors/:hospital', (req, res) => doctor.indexbyHospital(req, res))
    route.get('/doctors/:doctor', (req, res) => doctor.read(req, res))
    route.post('/doctors', (req, res) => doctor.create(req, res))

    // Routing for Hospital CRUD functions
    route.get('/hospitals/login', (req, res) => hospital.login(req, res))
    route.get('/hospitals/login/:hospital', (req, res) => hospital.readLocal(req, res))
    route.get('/hospitals/:hospital', (req, res) => hospital.read(req, res))
    route.get('/patients/:patient' +
        '/hospitals', (req, res) => hospital.index(req, res))

    route.get('/hospitals', (req, res) => hospital.getAll(req, res))
    route.post('/hospitals', (req, res) => hospital.create(req, res))

    // Routing for Diseases CRUD functions
    route.get('/patients/:patient' +
        '/diseases', (req, res) => disease.index(req, res))
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases', (req, res) => disease.indexbyHospital(req, res))
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases/:disease', (req, res) => disease.read(req, res))

    // Routing for Records CRUD functions
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases/:disease' +
        '/records', (req, res) => record.index(req, res))
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases/:disease' +
        '/records/:date', (req, res) => record.read(req, res))
    route.get('/patients/:patient' +
        '/diseases/:disease' +
        '/records', (req, res) => record.indexbyDisease(req, res))
    route.get('/records', (req, res) => record.readbyDisease(req, res))
    route.post('/records', (req, res) => record.create(req, res))

    // Routing for timestamp
    route.get('/time', (req, res) => {
        res.status(200).json(Date.now()).end()
    })

}