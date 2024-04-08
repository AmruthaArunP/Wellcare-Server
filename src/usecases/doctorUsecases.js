const doctorRepository = require('../repositories/doctorRepository')
const securePassword = require('../services/securePassword')
const mailSender = require('../services/nodemailer')
const {dateTime} = require('../services/dateAndTime')
const {createDoctorTokens} = require('../middlewares/jwt')
const bcrypt = require('bcrypt')

const doctorUsecases = {

    createDoctor : async (name, email, age, mobile, password ,image) => {
        try {
            const existingDoctor = await doctorRepository.findDoctorByEmail(email)
            if(existingDoctor){
                return {error : 'This email is already exist'}
            }else{
                const hashedPassword = await securePassword(password) 
                const Otp = Math.floor(1000 + Math.random() * 9000);
                console.log(Otp);
                const doctorDetails = {
                    name: name,
                    email: email,
                    age: age,
                    contact: mobile,
                    password: hashedPassword,
                    otp: Otp,
                    image:image,
                    timeStamp: dateTime,
                }
                const doctor = await doctorRepository.createDoctor(doctorDetails)
                if(doctor){
                    await mailSender(email, Otp, "signup");
                    const data = {
                      message: "Check mail",
                      email:email,
                    };
                    return data
                  }
            }
        } catch (error) {
            console.error(error);
            return { error: "An error occurred" };
        }
    },

    verify : async (email,otp) => {
        try {
            const doctorDetails = await doctorRepository.findDoctorByEmail(email);
            console.log(typeof(doctorDetails.otp));
            console.log(typeof(otp));
            if(!doctorDetails){
                return {error : 'invalid email'}
            }else{
                
                if(doctorDetails.otp !== otp){
                    return { error : 'Invalid otp'}
                }else{
                    const doctorData = await doctorRepository.updateData(email);
                    if(doctorData){
                        return { message: 'Verified successfully'}
                    }
                }
            }
        } catch (error) {
            console.error(error);
            return { error: "An error occurred" };
        }
    },

    resendOtp : async (email) => {
        try {
            const doctor = await doctorRepository.findDoctorByEmail(email);
            if(doctor){
                const otp = Math.floor(1000 + Math.random() * 9000);
                console.log(otp);
                const update = await doctorRepository.updateDoctorOTP(email, otp);
                await mailSender(email, otp, "signup");
                const data = {
                  message: "Check mail",
                  email:email,
                };
                return data
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            throw new Error('Failed to resend OTP');
        }
    },

    forgotPassword : async (email) => {
        try {
          const doctor = await doctorRepository.findDoctorByEmail(email);
          if(doctor){
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log("otp for changin password:",otp);
            doctor.otp=otp
            await doctorRepository.saveUser(doctor)
            await mailSender(email, otp, "forgotPassword");
            const data = {
              message: "Check mail",
              email:email,
            };
            return data
          }else{
            return { error: "Invalid email" };
          }  
        } catch (error) {
          console.error('Error resending OTP:', error);
          throw new Error('Failed to resend OTP');
        }
      },

      resetPassword : async (email , password) => {
        try {
          console.log('comming data:',email, password);
          const hashedPassword = await securePassword(password)
          return await doctorRepository.resetPassword(email, hashedPassword)
        } catch (error) {
          throw new Error('Failed to reset password');
        }
      },

    loginDoctor : async (email , password) => {
        try {
            console.log(email, password);
            const doctorData = await doctorRepository.findDoctorByEmail(email);
            if(doctorData){
                const passwordMatch = await bcrypt.compare(password, doctorData.password);
                if(passwordMatch){
                    if(doctorData.isVerified){
                          if (!doctorData.isBlocked) {
                            const token = createDoctorTokens(doctorData._id, 'doctor');
                            console.log("login time - doctorToken is :", token);

                            return {doctorData ,token };
                          } else {
                            return { error :'blocked'};
                          }
                        }else{
                            return { error :'notApproved'};
                        }
                   
                    }else{
                    return { error: "unauthorized" };
                }
            }else{
                return { error: "unauthorized" };
            }
        } catch (error) {
            console.error(error);
            return { error: "An error occurred" };
        }
    },

    doctorData : async (email) => {
        const doctor = await doctorRepository.findDoctorByEmail(email);
        if(!doctor){
            throw new Error('Doctor not found');
        }
        return doctor;
    },
    
    fetchDoctorById : async (doctorId) => {
        try {
            const doctor = doctorRepository.getDoctorById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            return doctor;
        } catch (error) {
            throw error;
        }
    },

    departments : async () => {
        try {
            return await doctorRepository.departments()
        } catch (error) {
            throw new Error("Failed to fetch departments");
        }
    },

    deleteDocument : async (deleteData, doctorId) => {
         try {
            //console.log('delete data 2:',deleteData);
            const doctorData = await doctorRepository.deleteDocument(deleteData, doctorId); 
            return doctorData;
         } catch (error) {
            throw new Error("Error deleting document");
         }
    },

    setDoctorProfile : async (id, profileData) => {
        try {
            
            const updatedDoctor = await doctorRepository.updateDoctorProfile(id, profileData);
            return updatedDoctor;
          } catch (error) {
            throw new Error('Error setting doctor profile');
          }
    },

    addSchedule: async (doctorId, date, time) => {
        try {
            const existingSchedule = await doctorRepository.findScheduleByDoctorAndDate(doctorId, date);
            //console.log('existing:', existingSchedule);
            if (existingSchedule) {
                const uniqueTimes = time.filter(newTime => !existingSchedule.time.includes(newTime));
                
                if (uniqueTimes.length > 0) {
                    const newTime = [...existingSchedule.time, ...uniqueTimes];
                    await doctorRepository.updateSchedule(doctorId, date, newTime);
                }
                
            } else {
                await doctorRepository.createSchedule(doctorId, date, time);
            }
        } catch (error) {
            throw new Error('Error setting doctor schedule');
        }
    },

    removeSchedule : async (doctorId,date, time) => {
        try {
            //console.log("comming data 2:",date, time);
            const existingSchedule = await doctorRepository.findScheduleByDoctorAndDate(doctorId, date)
            if (existingSchedule) {
                if (existingSchedule.time.length === 1) {
                  await doctorRepository.deleteSchedule(doctorId, date);
                } else {
                    console.log("comming data 3:",date, time);
                  await doctorRepository.removeSchedule(doctorId, date, time);
                }
              }
        } catch (error) {
            throw new Error('Error setting doctor schedule');
        }
    },

    getDoctorSchedule : async (doctorId) => {
        return await doctorRepository.findScheduleByDoctor(doctorId);
    },

    getSchedule : async (doctorId) => {
        try {
           const schedule = await doctorRepository.getSchedule(doctorId)     
           return schedule;       
        } catch (error) {
            throw new Error('Error getting doctor schedule'); 
        }
    },

    doctorAppoinments : async (id) => {
        try {
            return await doctorRepository.doctorAppoinments(id)
        } catch (error) {
            throw new Error('Error getting doctor appoinment'); 
        }
    },

    consult : async (id) => {
        try {
            //console.log('2',id);
            return await doctorRepository.consult(id)
        } catch (error) {
            throw new Error('Error getting doctor consultation details');
        }
    },

    endAppointment : async (id) => {
        try {
            return await doctorRepository.endAppointment(id)
        } catch (error) {
            throw new Error('Error ending appoinment');
        }
    },

    getDocChatEssentials : async (chatId) => {
        try {
            const booking = await doctorRepository.findAppointmentByUserId(chatId);
            if (booking) {
              const doctor = await doctorRepository.findBookingDoctorById(booking.doctor);
              if (doctor) {
                const user = await doctorRepository.findUserById(booking.user);
                if (user) {
                  return { doctor, user };
                } else {
                  throw new Error('User data not found');
                }
              } else {
                throw new Error('Doctor data not found');
              }
            } else {
              throw new Error('Booking data not found');
            }
        } catch (error) {
            throw new Error('Internal server error');
        }
    },

    addPrescription : async (appointmentId, prescriptionData) => {
        try {
            const med = new Map();
            prescriptionData.forEach(({ medicine, selectedDose }) => {
              med.set(medicine, selectedDose);
            });
            return await doctorRepository.updateAppointment(appointmentId, { medicines: med });
          } catch (error) {
            throw new Error('Error adding prescription');
          }
    },

    patients : async (id) => {
        try {
            return await doctorRepository.doctorAppoinments(id)
        } catch (error) {
            throw new Error('Error fetching patient details');
        }
    },

    dash : async (id) => {
        try {
            return await doctorRepository.findAppointmentByDocId(id)
        } catch (error) {
            throw new Error('Error fetching appoinment details of doctor');
        }
    }

}

module.exports = doctorUsecases;