const express = require('express')
const adminRoute = express()
const adminController = require('../controllers/adminController');
const upload = require('../../middlewares/multer')
const { validateAdminToken } = require('../../middlewares/jwt');

adminRoute.post('/login', adminController.login);
adminRoute.get('/patients', validateAdminToken, adminController.findPatients);
adminRoute.patch('/managePatient', validateAdminToken, adminController.managePatient);
adminRoute.get('/doctors', validateAdminToken, adminController.findDoctors);
adminRoute.patch('/manageDoctor', validateAdminToken, adminController.manageDoctor);
adminRoute.patch('/approveDoctor/:id', validateAdminToken, adminController.approveDoctor);
adminRoute.post('/createDepartment', upload.single('image'), validateAdminToken, adminController.createDepartment);
adminRoute.get('/departments', validateAdminToken, adminController.departments);
adminRoute.patch('/manageDepartment',validateAdminToken, adminController.manageDepartment);


module.exports = adminRoute;