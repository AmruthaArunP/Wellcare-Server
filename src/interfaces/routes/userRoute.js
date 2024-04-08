const express = require('express')
const userRoute = express()
const userController = require('../controllers/userController')
const {validateToken, authorizeRole} = require('../../middlewares/jwt');
const upload = require('../../middlewares/multer');
const { authUser } = require('../../middlewares/auth');
const ChatUsecases = require('../../usecases/ChatUsecases');



userRoute.post('/signup',userController.signup);
userRoute.post('/google/signup', userController.googleSignup)
userRoute.post('/verify/:email', userController.verify);
userRoute.post('/login' , userController.login);
userRoute.post('/google/signin', userController.googleSignin)
userRoute.post('/resendOtp/:email' , userController.resendOtp);
userRoute.get('/forgotPassword/:email',userController.forgotPassword)
userRoute.patch('/resetPassword/:email', userController.resetPassword)
userRoute.get('/findDoctors',userController.findDoctors);
userRoute.get('/findSpeciality', userController.findSpeciality)
userRoute.get('/searchDoctor/:searchKey', userController.searchDoctor)
userRoute.get('/getUserProfile',validateToken, authorizeRole('user'), userController.getUserProfile)
userRoute.post('/updateProfile',upload.array('images'), validateToken,authorizeRole('user'), authUser, userController.updateUserProfile)
userRoute.delete('/deleteDocument/:deleteData', validateToken,authorizeRole('user'), userController.deleteDocument)
userRoute.get('/docSchedule/:docId',validateToken ,authorizeRole('user'),authUser,userController.docSchedule)
userRoute.post('/checkSlot', validateToken,authorizeRole('user'), userController.checkSlot)
userRoute.post('/bookSlot', validateToken,authorizeRole('user'), userController.bookSlot)
userRoute.get('/userAppoinments', validateToken,authorizeRole('user'), authUser, userController.userAppoinments)
userRoute.post('/cancelAppoinment/:id', validateToken,authorizeRole('user'), authUser, userController.cancelAppoinment)
userRoute.get('/load-user-chatess/:chatId', validateToken,authorizeRole('user'), userController.userChatEssentials)
userRoute.get('/prescriptions', validateToken,authorizeRole('user'), authUser, userController.prescriptions)
userRoute.get('/chat/history', validateToken, authorizeRole('user'), ChatUsecases.getChatByChatId)



module.exports = userRoute
