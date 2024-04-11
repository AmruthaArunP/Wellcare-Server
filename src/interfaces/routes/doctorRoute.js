const express = require('express');
const doctorController = require('../controllers/doctorController')
const upload = require('../../middlewares/multer');
const { validateDoctorToken, authorizeRole } = require('../../middlewares/jwt');
const ChatUsecases = require('../../usecases/ChatUsecases');
const doctorRoute = express();

doctorRoute.post('/signup' ,upload.single('image'), doctorController.doctorSignup);
doctorRoute.post('/verify/:email', doctorController.verifyEmail);
doctorRoute.post('/login' , doctorController.login);
doctorRoute.post('/resendOtp/:email' , doctorController.resendOtp);
doctorRoute.get('/forgotPassword/:email',doctorController.forgotPassword)
doctorRoute.patch('/resetPassword/:email', doctorController.resetPassword)
doctorRoute.get('/getDoctor/:email', validateDoctorToken,authorizeRole('doctor'), doctorController.getDoctor);
doctorRoute.get('/getDoctorProfile', validateDoctorToken,authorizeRole('doctor'), doctorController.getDoctorProfile);
doctorRoute.delete('/deleteDocument/:deleteData', validateDoctorToken,authorizeRole('doctor'), doctorController.deleteDocument);
doctorRoute.get('/departments', validateDoctorToken,authorizeRole('doctor'), doctorController.departments)
doctorRoute.post('/updateProfile',upload.array('images'), validateDoctorToken,authorizeRole('doctor'), doctorController.updateProfile)
doctorRoute.post('/addSchedule', validateDoctorToken,authorizeRole('doctor'), doctorController.setSchedule)
doctorRoute.post('/removeSchedule', validateDoctorToken,authorizeRole('doctor'), doctorController.removeSchedule)
doctorRoute.get('/getSchedule', validateDoctorToken,authorizeRole('doctor'), doctorController.getSchedule)
doctorRoute.get('/doctorAppoinments', validateDoctorToken,authorizeRole('doctor'), doctorController.doctorAppoinments)
doctorRoute.get('/consult', validateDoctorToken,authorizeRole('doctor'), doctorController.consult)
doctorRoute.patch('/doctorEndAppointment/:appId', validateDoctorToken,authorizeRole('doctor'), doctorController.endAppointment)
doctorRoute.get('/load-doc-chatess/:chatId',validateDoctorToken,authorizeRole('doctor'), doctorController.docChatEssentials)
doctorRoute.get('/schedule-data', validateDoctorToken,authorizeRole('doctor'), doctorController.viewDocSchedule)
doctorRoute.patch('/addPrescription', validateDoctorToken,authorizeRole('doctor'), doctorController.addPrescription)
doctorRoute.get('/patients', validateDoctorToken,authorizeRole('doctor'), doctorController.patients)
doctorRoute.get('/chat/history', validateDoctorToken,authorizeRole('doctor'), ChatUsecases.getChatByChatId)
doctorRoute.get('/dashboard', validateDoctorToken,authorizeRole('doctor'), doctorController.dash)
doctorRoute.get('/prescriptions', validateDoctorToken, authorizeRole('doctor'), doctorController.prescriptions)





module.exports = doctorRoute;