const express = require('express')
const adminRoute = express()
const adminController = require('../controllers/adminController');
const upload = require('../../middlewares/multer')
const { validateAdminToken, authorizeRole } = require('../../middlewares/jwt');

adminRoute.post('/login', adminController.login);
adminRoute.get('/patients', validateAdminToken,authorizeRole('admin'), adminController.findPatients);
adminRoute.patch('/managePatient', validateAdminToken,authorizeRole('admin'), adminController.managePatient);
adminRoute.get('/doctors', validateAdminToken,authorizeRole('admin'), adminController.findDoctors);
adminRoute.patch('/manageDoctor', validateAdminToken,authorizeRole('admin'), adminController.manageDoctor);
adminRoute.patch('/approveDoctor/:id', validateAdminToken,authorizeRole('admin'), adminController.approveDoctor);
adminRoute.post('/createDepartment', upload.single('image'),validateAdminToken, authorizeRole('admin'),  adminController.createDepartment);
adminRoute.get('/departments', validateAdminToken,authorizeRole('admin'), adminController.departments);
adminRoute.patch('/manageDepartment',validateAdminToken,authorizeRole('admin'), adminController.manageDepartment);
adminRoute.get('/income', validateAdminToken,authorizeRole('admin'), adminController.appoints)


module.exports = adminRoute;