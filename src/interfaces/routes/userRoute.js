const express = require('express')
const userRoute = express()
const userController = require('../controllers/userController')
const {validateToken} = require('../../middlewares/jwt');
const upload = require('../../middlewares/multer');
const { authUser } = require('../../middlewares/auth');



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
userRoute.get('/getUserProfile',validateToken, userController.getUserProfile)
userRoute.post('/updateProfile',upload.array('images'), validateToken,authUser, userController.updateUserProfile)
userRoute.delete('/deleteDocument/:deleteData', validateToken, userController.deleteDocument)
userRoute.get('/docSchedule/:docId',validateToken ,authUser,userController.docSchedule)
userRoute.post('/checkSlot', validateToken, userController.checkSlot)
userRoute.post('/bookSlot', validateToken, userController.bookSlot)
userRoute.get('/userAppoinments', validateToken, authUser, userController.userAppoinments)
userRoute.post('/cancelAppoinment/:id', validateToken, authUser, userController.cancelAppoinment)
userRoute.get('/load-user-chatess/:chatId', validateToken, userController.userChatEssentials)
userRoute.get('/prescriptions', validateToken, authUser, userController.prescriptions)



module.exports = userRoute
