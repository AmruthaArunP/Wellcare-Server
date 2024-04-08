const doctorUsecases = require('../../usecases/doctorUsecases')

const doctorController = {
    
    doctorSignup : async (req , res) => {
        try {
            const { name, email, age, mobile, password } = req.body;
            const image = req.file?.filename;
            const doctorData = await doctorUsecases.createDoctor(name, email, age, mobile, password, image);
            console.log(doctorData);
            res.status(201).json(doctorData);
        } catch (error) {
            console.error(error);
            res.status(500).json({error : 'Internal server error'});
        }
    },

    verifyEmail : async (req , res) => {
        try {
            const { email } = req.params;
            const { otp } = req.body;
            const result = await doctorUsecases.verify(email , otp) ;
            res.json(result)
        } catch (error) {
            res.status(500).json({error:'Internal server error'}) 
        }
    },

    resendOtp : async (req , res) => {
        try {
            const { email} = req.params;
            const result = await doctorUsecases.resendOtp(email);
            res.status(200).json({message : "Check mail",result})
        } catch (error) {
            res.status(500).json({ message: 'Failed to resend OTP'} ) 
        }
    },

    forgotPassword : async (req, res) => {
        try {
            const {email} = req.params;
            const data = await doctorUsecases.forgotPassword(email);
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
            const data = await doctorUsecases.resetPassword(email, password);
            console.log("after canging:", data);
            res.status(200).json({message : 'password reset successfully',data})
        } catch (error) {
            res.status(500).json({ message: 'Failed to reset password'} )
        }
    },

    login : async (req , res) => {
        try {
            const {email , password} = req.body;
            const result = await doctorUsecases.loginDoctor(email , password);
            if (result.error) {
                return res.json({ error : result.error });
              } else {
                const { token, doctorData } = result;
                res.status(200).json({ message: "Login Successfully", token, doctorData });
              }            
        } catch (error) {
            console.error(error)
            res.status(500).json({error:'Internal server error'}) 
        }
    },

    getDoctor : async (req, res) => {
        try {
            const { email} = req.params; 
            const doctorData = await doctorUsecases.doctorData(email);
            res.json(doctorData)
        } catch (error) {
            console.error(error)
            res.status(500).json({error:'Internal server error'}) 
        }
    },

    getDoctorProfile : async (req, res) => {
        try {
            const doctorId = req._id.id
            //console.log("id of dr:", doctorId);
            const doctor = await doctorUsecases.fetchDoctorById(doctorId);
            console.log('doctor profile:',doctor);
            res.json(doctor);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    deleteDocument : async (req, res) => {
        try {
            const deleteData = req.params.deleteData;
            console.log('delete data:',deleteData);
            const doctorData = await doctorUsecases.deleteDocument(deleteData ,req._id.id);
            res.status(200).json(doctorData);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    departments : async (req, res) => {
        try {
            console.log("received data");
            const departmentsData = await doctorUsecases.departments()
            console.log("department details.....",departmentsData);
            if(departmentsData){
                res.status(200).json(departmentsData)
            }else{
                res.json(error)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
          const { name, age, gender, fee, contact, qualification, department, address, experience, prChange } = req.body;
          const files = req.files || [];
          let profileData = { name, age, contact, qualification, department, gender, fee, address, experience };
      
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
          }
      
          const updatedDoctor = await doctorUsecases.setDoctorProfile(req._id.id, profileData);
          res.status(200).json({ message: "updated Successfully", updatedDoctor });
        } catch (error) {
          console.error('Error setting doctor profile:', error);
          res.status(500).json({ error: 'An error occurred while setting doctor profile' });
        }
      },
      

    setSchedule : async (req, res) => {
        try {
           const { date, time, action} = req.body;
           const doctorId = req._id.id;
           
           
           if(action === 'add'){
             await doctorUsecases.addSchedule(doctorId, date, time)
           }else{
            console.log("comming data 1:",date, time, action);
             await doctorUsecases.removeSchedule(doctorId, date, time)
           }
           const updatedSchedule = await doctorUsecases.getDoctorSchedule(doctorId)
           console.log("removed :",updatedSchedule);
           res.status(200).json({message:"Schedule updated succesfully",updatedSchedule})

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while setting doctor schedule' });
        }
    },

    removeSchedule : async (req, res ) => {
        
            try {
               const { date, time, action} = req.body;
               const doctorId = req._id.id;
               
               
               if(action === 'remove'){
                await doctorUsecases.removeSchedule(doctorId, date, time)
                 
               }else{
                console.log("comming data 1:",date, time, action);
                await doctorUsecases.addSchedule(doctorId, date, time)
               }
               const updatedSchedule = await doctorUsecases.getDoctorSchedule(doctorId)
               console.log("removed :",updatedSchedule);
               res.status(200).json({message:"Schedule updated succesfully",updatedSchedule})
    
            } catch (error) {
                res.status(500).json({ error: 'An error occurred while setting doctor schedule' });
            }
        
    },

    getSchedule : async (req, res) => {
        try {
            const doctorId = req._id.id
            const schedule = await doctorUsecases.getSchedule(doctorId)
            console.log(schedule);
            res.json(schedule)
        } catch (error) {
            console.log("error getting schedule:",error);
            res.status(500).json({ error: 'An error occurred while getting doctor schedule' });
        }
    },

    doctorAppoinments : async (req, res) => {
        try {
            const id = req._id.id;
            console.log(id);
            const appoinments = await doctorUsecases.doctorAppoinments(id)
            res.json(appoinments)
        } catch (error) {
            console.log("error getting appoinment:",error);
            res.status(500).json({ error: 'An error occurred while getting doctor appoinment' });
        }
    },

    consult : async (req, res) => {
        try {
            const id = req._id.id;
            console.log(id);
            const appoinments = await doctorUsecases.consult(id)
            res.json(appoinments)
        } catch (error) {
            console.log("error getting consultation appoinment:",error);
            res.status(500).json({ error: 'An error occurred while getting doctor consultation appoinment' });
        }
    },

    endAppointment : async ( req, res) => {
        try {
            const appId = req.params.appId;
            console.log("Ending appointment -> appoinment id :",appId);
            const deleteAppoinment = await doctorUsecases.endAppointment(appId)
            res.json("success");
        } catch (error) {
            console.log("error editting appoinment:",error);
            res.status(500).json({ error: 'An error occurred while editting appoinment' });
        }
    },

    docChatEssentials : async (req, res) => {
        try {
            const chatId = req.params.chatId;
            const { doctor, user } = await doctorUsecases.getDocChatEssentials(chatId);
            console.log("doctor data in booking user ==>",doctor, user);
            res.status(200).json({ message: 'Booking and doctor data found', doctor, user })
            
        } catch (error) {
            if (error.message === 'Booking data not found' || error.message === 'Doctor data not found' || error.message === 'User data not found') {
                res.status(404).json({ message: error.message });
              } else {
                res.status(500).json({ message: error.message });
              }
        }
    },

    viewDocSchedule : async (req, res) => {
        try {
            console.log("received from doc home page");
            const  doctorId  = req._id.id;
            const schedule = await doctorUsecases.getSchedule(doctorId)
            if (schedule) {
                 res.status(200).json({ message: "Doctors Schedule found", schedule: schedule })
            } else {
                res.status(404).json({ message: "Cannot find doctors schedule" })
            }
        } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
        }
    },

    addPrescription : async (req, res) => {
        try {
            const data = req.body
            const appoinment = await doctorUsecases.addPrescription(data[0].id, data);
            console.log('addpoinment data after updating medicine:*******',appoinment);
            res.json('done');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    patients : async (req, res) => {
        try {
            const id = req._id.id 
            const data = await doctorUsecases.patients(id)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    dash : async (req, res) => {
        try {
            const doctorId = req._id.id
            const data = await doctorUsecases.dash(doctorId)
            res.json(data)
        } catch (error) {
            console.log(error);
        }
    }

}


module.exports = doctorController;