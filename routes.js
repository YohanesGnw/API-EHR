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
    route.get('/patients/:patient', (req, res) => patient.read(req, res))
    route.post('/patients', (req, res) => patient.create(req, res))

    // Routing for Doctor CRUD functions
    route.get('/doctors', (req, res) => doctor.index(req, res))
    route.get('/doctors/:doctor', (req, res) => doctor.read(req, res))
    route.post('/doctors', (req, res) => doctor.create(req, res))

    // Routing for Hospital CRUD functions
    route.get('/patients/:patient' +
        '/hospitals', (req, res) => hospital.index(req, res))
    route.get('/hospitals/:hospital', (req, res) => hospital.read(req, res))
    route.post('/hospitals', (req, res) => hospital.create(req, res))

    // Routing for Diseases CRUD functions
    route.get('/patients/:patient' +
        '/diseases', (req, res) => disease.index(req, res))

    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases', (req, res) => disease.indexbyHospital(req, res))

    // Routing for Records CRUD functions
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases/:disease' +
        '/records', (req, res) => record.index(req, res))
    route.get('/patients/:patient' +
        '/hospitals/:hospital' +
        '/diseases/:disease' +
        '/records/:date', (req, res) => record.read(req, res))
    route.post('/records', (req, res) => record.create(req, res))
}