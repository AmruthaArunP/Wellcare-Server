const express = require('express');
const doctorController = require('../controllers/doctorController')
const upload = require('../../middlewares/multer');
const { validateDoctorToken } = require('../../middlewares/jwt');
const ChatUsecases = require('../../usecases/ChatUsecases');
const doctorRoute = express();

doctorRoute.post('/signup' ,upload.single('image'), doctorController.doctorSignup);
doctorRoute.post('/verify/:email', doctorController.verifyEmail);
doctorRoute.post('/login' , doctorController.login);
doctorRoute.post('/resendOtp/:email' , doctorController.resendOtp);
doctorRoute.get('/forgotPassword/:email',doctorController.forgotPassword)
doctorRoute.patch('/resetPassword/:email', doctorController.resetPassword)
doctorRoute.get('/getDoctor/:email', validateDoctorToken, doctorController.getDoctor);
doctorRoute.get('/getDoctorProfile', validateDoctorToken, doctorController.getDoctorProfile);
doctorRoute.delete('/deleteDocument/:deleteData', validateDoctorToken, doctorController.deleteDocument);
doctorRoute.get('/departments', validateDoctorToken, doctorController.departments)
doctorRoute.post('/updateProfile',upload.array('images'), validateDoctorToken, doctorController.updateProfile)
doctorRoute.post('/addSchedule', validateDoctorToken, doctorController.setSchedule)
doctorRoute.post('/removeSchedule', validateDoctorToken, doctorController.removeSchedule)
doctorRoute.get('/getSchedule', validateDoctorToken, doctorController.getSchedule)
doctorRoute.get('/doctorAppoinments', validateDoctorToken, doctorController.doctorAppoinments)
doctorRoute.get('/consult', validateDoctorToken, doctorController.consult)
doctorRoute.patch('/doctorEndAppointment/:appId', validateDoctorToken, doctorController.endAppointment)
doctorRoute.get('/load-doc-chatess/:chatId',validateDoctorToken, doctorController.docChatEssentials)
doctorRoute.get('/schedule-data', validateDoctorToken, doctorController.viewDocSchedule)
doctorRoute.patch('/addPrescription', validateDoctorToken, doctorController.addPrescription)
doctorRoute.get('/patients', validateDoctorToken, doctorController.patients)
doctorRoute.get('/chat/history', validateDoctorToken, ChatUsecases.getChatByChatId)





module.exports = doctorRoute;