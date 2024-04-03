const userUsecases = require('../../usecases/userUseCases')
const Schedule = require('../../entities/scheduleModel')
require('dotenv').config();

const userController = {
    
    signup : async (req , res)=>{
        try {
            const userData = req.body;
            const result = await userUsecases.signup(userData )
            if(result.error){
                return res.json( { error : result.error } );
            }
            res.status(201).json(result)
        } catch (error) {
            console.error(error);
            res.status(500).json({error : "Internal server error"})
        }
        
    },

    googleSignup : async (req, res) => {
        try {
            const { displayName, email } = req.body;
            console.log("data comming:",displayName, email);
            const user = await userUsecases.googleSignup(displayName, email )
            if(user.error){
                return res.json( user.error );
            }else {
                console.log('user data:',user);
                return res.status(201).json({ message: "User registered successfully" });
            }
           
        } catch (error) {
            console.error(error);
            res.status(500).json({error : "Internal server error"})
        }
    },

    verify : async (req , res) => {
        try {
            const { email } = req.params;
            const { otp } = req.body;
            const result  = await userUsecases.verifyEmail( email , otp );
            res.json( result );
        } catch (error) {
             res.status(500).json({error:'Internal server error'})           
        }
    },

    resendOtp : async (req, res) => {
        try {
            const {email} =req.params;
            const result = await userUsecases.resendOtp(email);
            res.status(200).json({message : "Check mail",result})
        } catch (error) {
           res.status(500).json({ message: 'Failed to resend OTP'} ) 
        }
    },

    forgotPassword : async (req, res) => {
        try {
            const {email} = req.params;
            const data = await userUsecases.forgotPassword(email);
            console.log(data);
            if(data.error){
                return res.json( 'not found');
            } 
            res.json("success")      
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to find email'} )
        }
    },

    resetPassword : async (req, res) => {
        try {
            const { email } = req.params;
            const { password } = req.body;
            console.log('comming data:',email, password);
            const user = await userUsecases.resetPassword(email, password);
            console.log("after canging:", user);
            res.status(200).json({message : 'password reset successfully',user})
        } catch (error) {
            res.status(500).json({ message: 'Failed to reset password'} )
        }
    },

    login : async (req , res) => {
        try {
            const { email , password } = req.body;
            const result = await userUsecases.loginUser(email , password);
            console.log("Error is........",result.error);
            if (result.error) {
                return res.json({ error : result.error });
              } else {
                const { token, userData } = result;
                console.log('user',userData);
                return res.status(200).json({ message: "Login Successfully", token, userData });
              }
        } catch (error) {
            console.error("Error occurred during login:", error);
             res.status(400).json({ message: error.message });
        }
    },

    googleSignin : async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userUsecases.googleSignin(email)
            if(user.error){
                return res.json({ error : user.error });
            }else{
                const { userData, token } = user;
                res.json({userData, token});
            }
         } catch (error) {
            console.log('error while logging with google:',error)
             res.status(400).json({ message: error.message });
        }
    },

    findDoctors : async (req, res) => {
        try {
            const doctors = await userUsecases.findDoctors();
            res.status(200).json(doctors)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); 
        }
    },

    searchDoctor : async (req, res) => {
        try {
            const { searchKey } = req.params
            const doctor = await userUsecases.searchDoctor(searchKey)
            console.log('searched doc:',doctor);
            res.status(200).json(doctor)
        } catch (error) {
            console.log('error while searching doctor:',error)
            res.status(400).json({ message: error.message });
        }
    },

    findSpeciality : async (req, res) => {
        try {
            const specialities = await userUsecases.findSpeciality()
            console.log("specialities are:**********",specialities);
            res.status(200).json(specialities)
        } catch (error) {
            console.log('error while fetching departments:',error)
            res.status(400).json({ message: error.message });
        }

    },

    getUserProfile : async (req, res) => {
        try {
            const userId = req._id.id
            console.log("reached");
            console.log("id of user:", userId);
            const user = await userUsecases.fetchUserById(userId);
            console.log('user profile:',user);
            res.json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    updateUserProfile : async (req, res) =>{
        try {
            const { name, age, address, contact, gender, prChange } = req.body;
            console.log("updating name:",name);
            const files = req.files || [];
            console.log('data received');
            console.log("currunt no of files;",files.length );
            let profileData = { name, age, address, contact, gender  };
            console.log("currunt no of files;",files.length );
            if (files.length > 0) {
                
                const fileNames = files.map((el) => el.filename);
          
                if (prChange === 'true') {
                  const profile = fileNames.shift();
                  profileData.image = profile;
          
                  if (fileNames.length > 0) {
                    profileData.documents = fileNames;
                  }
                } else {
                    if (req.body.documents) {
                      const existingDocuments = Array.isArray(req.body.documents) ? req.body.documents : [req.body.documents];
                      profileData.documents = [...existingDocuments, ...fileNames];
                    } else {
                      profileData.documents = fileNames;
                    }
                  }
                console.log('data received 2');
                const updatedUser = await userUsecases.setUserProfile(req._id.id, profileData);
                console.log("updated user:",updatedUser);
                res.status(200).json({message: "updated Successfully",updatedUser});
              }
              const updatedUser = await userUsecases.setUserProfile(req._id.id, profileData);
              res.status(200).json({message: "updated Successfully",updatedUser});
        } catch (error) {
            console.error('Error setting doctor profile:', error);
            res.status(500).json({ error: 'An error occurred while setting user profile' });
        }
    },

    deleteDocument : async (req, res) => {
        try {
            const deleteData = req.params.deleteData;
            console.log('delete doc:',deleteData);
            const userData = await userUsecases.deleteData(deleteData ,req._id.id)
            console.log("after deleting:",userData);
            res.status(200).json(userData);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    },

    docSchedule : async (req, res) => {
        try {
            const docId = req.params.docId;
            console.log(docId);
            const slot = await userUsecases.getVailableSlots(docId)
            res.json(slot)
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' }); 
        }
    },

    checkSlot : async (req, res) => {
        try {
            const {doctor, user, time, day} = req.body
            const slots = await userUsecases.checkSlot(doctor, time, day)
            console.log('checkslots:',slots);
            if(slots.length > 0){
                res.json('unavailable')
            }else{
                res.json('available')
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    bookSlot : async (req, res) => {
        try {
            const { doctor, issues, fee, user, date, time } = req.body;
            const bookAppoinment = await userUsecases.bookAppoinment(doctor, issues, fee, user, date, time)
            if(bookAppoinment){
                res.json("success");
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    userAppoinments : async (req, res) => {
        try {
            const id = req._id.id;
            const user = await userUsecases.userData(id)
            const appoinments = await userUsecases.userAppoinments(id)
            res.json({appoinments,user})
        } catch (error) {
            console.log("error feting appoinment:",error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    cancelAppoinment : async (req, res) => {
        try {
            console.log(1);
            const { id } = req.params;
            console.log("id is:", id);
            const appoinmentCancel = await userUsecases.cancelAppoinment(id) 
            console.log(appoinmentCancel);
            res.json("cancelled");
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred" }); 
        }
    },

    userChatEssentials : async (req, res) => {
        try {
            const {chatId} = req.params;
            const { doctor, user } = await userUsecases.getUserChatEssentials(chatId);
            console.log('booking Apooinment user and doctor:',doctor, user);
            res.status(200).json({ message: 'Booking and doctor data found', doctor, user });
        } catch (error) {
            if (error.message === 'Booking data not found' || error.message === 'Doctor data not found' || error.message === 'User data not found') {
                res.status(404).json({ message: error.message });
              } else {
                res.status(500).json({ message: error.message });
              }
        }
    },

    prescriptions : async (req, res) => {
        try {
            const id = req._id.id;
            const data = await userUsecases.prescriptions(id)
            console.log("prescription for user****************:",data);
            res.json(data);
        } catch (error) {
            
        }
    }
}

module.exports = userController;
