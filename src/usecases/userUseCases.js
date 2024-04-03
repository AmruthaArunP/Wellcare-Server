const userRepository = require('../repositories/userRepository')
const securePassword = require('../services/securePassword')
const randomstring = require("randomstring");
const {dateTime} = require('../services/dateAndTime')
const mailSender = require('../services/nodemailer')
const bcrypt = require('bcrypt')
const {createTokens} = require('../middlewares/jwt')


const userUsecases = {
    /*Signup for user*/
    signup : async (userData) => {
        try {
          console.log(userData);
            const {Name ,Email ,Age , Mobile ,Password } = userData;
            const existUser = await userRepository.findByEmail(Email)
            if(!existUser) {
                const hashedPassword = await securePassword(Password)
                const otp = Math.floor(1000 + Math.random() * 9000);
                console.log('otp is:',otp);
                const userDetails = {
                    userName: Name,
                    email: Email,
                    age: Age,
                    contact: Mobile,
                    password: hashedPassword,
                    otp: otp,
                    timeStamp: dateTime,
                }
                const user = await userRepository.createUser(userDetails)
                if(user){
                    await mailSender(Email, otp, "signup");
                    const data = {
                      message: "Check mail",
                      email:Email,
                    };
                    return data
                  }
            }else {
              return { error: "Email is already registered" };
          }
        } catch (error) {
            console.error(error);
            return { error: "An error occurred" };
        }
    },

    googleSignup : async ( name , email) => {
      try {
        const existUser = await userRepository.findByEmail(email)
        console.log("existUser  ",existUser);
        if(!existUser){
          console.log("data comming 2:",name, email);
          const string = randomstring.generate();
          const newUser = {
            userName: name,
            email: email,
            age: null,
            contact: null,
            password: null,
            otp: null,
            token: string,
            timeStamp: dateTime,
        };
          return await userRepository.createUser(newUser)
        }else{
          return { error: "Email is already registered" };
        }

      } catch (error) {
        throw new Error("Error occured while sign up ");
      }
    },
    
    /* User email Verification*/
    verifyEmail: async (email, otp) => {
        try {
          const user = await userRepository.findByEmail(email);
          if (!user) {
            return { error: "Invalid email" };
          } else {
            const userOtp = parseInt(user.otp);
            console.log(typeof(userOtp),userOtp);
            console.log(typeof(otp),otp);
            if (userOtp !== otp) {
              
              return { error: "Invalid OTP" };
            } else {
              const userData = await userRepository.updateUser(email); 
              if (userData) {
                return { message: 'Verified successfully' };
              }
            }
          }
        } catch (error) {
          console.error(error);
          return { error: "An error occurred" };
        }
      },

      /*Resend OTP*/
      resendOtp : async (email) =>{
        try {
          const user = await userRepository.findByEmail(email);
          if(user){
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log("resend otp:",otp);
            user.otp=otp
            await user.save();
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
          const user = await userRepository.findByEmail(email);
          if(user){
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log("otp for changin password:",otp);
            user.otp=otp
            await userRepository.saveUser(user)
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
          return await userRepository.resetPassword(email, hashedPassword)
        } catch (error) {
          throw new Error('Failed to reset password');
        }
      },

      /*Login for user*/
      loginUser : async (email, password) => {
        try {
          console.log("2 usecases");
          const userData = await userRepository.findByEmail(email);
          console.log("userdata:",userData);
          if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
              if (userData.isVerified === true) {
                if (!userData.isBlocked) {
                  const token = createTokens(userData._id);
                  console.log("Login time - userToken is :", token);
                  return { userData, token };
                } else {
                  console.log('blocked user');
                  return { error: "blocked" };
                }
              } else {
                return { error: "unverified" };
              }
            } else {
              return { error: "unauthorized" };
            }
          } else {
            return { error: "unauthorized" };
          }
        } catch (error) {
          console.error(error);
          return { error: "An error occurred" };
        }
      },

      googleSignin : async (email) => {
        try {
          const userData = await userRepository.findByEmail(email)
          if(userData){
            if (!userData.isBlocked) {
              const token = createTokens(userData._id);
              return { userData, token };
            } else {
              return { error: "blocked" };
            }
          }else{
            return { error: "unauthorized" };
          }
        } catch (error) {
           throw new Error('Failed to signin with google');
        }
      },

      findDoctors : async () => {
        try {
          const doctors = await userRepository.findDoctors()
          return doctors;
        } catch (error) {
          throw new Error('Error fetching approved doctors');
        }
      },

      searchDoctor : async (searchKey) => {
        try {
          if (searchKey === "all"){
            const doctors = await userRepository.findDoctors()
            return doctors;
          }else{
            const doctors = await userRepository.searchDoctor(searchKey)
            return doctors;
          }  
        } catch (error) {
          throw new Error('Error searching doctor');
        }
      },

      findSpeciality : async () => {
        try {
          return await userRepository.findSpeciality()
        } catch (error) {
          throw new Error('Error fetching departments');
        }
      },

      setUserProfile : async (id, profileData) => {
        try {
            console.log("2 nd........",profileData);
            const updatedUser = await userRepository.updateUserProfile(id, profileData);
            return updatedUser;
          } catch (error) {
            throw new Error('Error setting user profile');
          }
    },

    deleteData : async (data, id) => {
      try {
        return await userRepository.deleteData(data, id)
      } catch (error) {
        throw new Error('Error deleting document');
      }
    },

      fetchUserById : async (userId) => {
        try {
            const user = userRepository.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    },

      getVailableSlots :async (docId) => {
        try {
          const data = await userRepository.getScheduleByDoctorId(docId);
          console.log(data);
          const appoint = await userRepository.getAppointmentsByDoctorId(docId);
          
          const availableSlots = data.reduce((result, dataItem) => {
            const { date, time } = dataItem;
      
            const existingSlot = result.find((slot) => slot.date === date);
            const appointTimes = appoint
              .filter((appointItem) => appointItem.date === date)
              .map((appointItem) => appointItem.time);
      
            if (!existingSlot) {
              result.push({
                date,
                time: time.filter((slot) => !appointTimes.includes(slot)),
              });
            } else {
              existingSlot.time = existingSlot.time.filter(
                (slot) => !appointTimes.includes(slot)
              );
            }
      
            return result;
          }, []);

          const slot = availableSlots.filter(async (el) => {
            if (new Date(el.date) < new Date()) {
              await userRepository.deteteOldSlot(el.date)
            }
          
            return new Date(el.date) >= new Date();
          });
          return slot;
        } catch (error) {
          throw new Error('Error fetching available slots');
        }
      },

      checkSlot : async (doctor, time, day) => {
        try {
         return await userRepository.checkSlot(doctor, time, day) 
        } catch (error) {
          throw new Error('Error fetching available slot');
        }
      },

      bookAppoinment : async (doctor, issues, fee, user, date, time) => {
        try {
          const bookSlot = await userRepository.bookSlot(doctor, issues, fee, user, date, time)
          return bookSlot;
        } catch (error) {
          throw new Error('Error updatting appoinment');
        }
      },

      userData : async (id) => {
        try {
          return await userRepository.userData(id)
        } catch (error) {
          throw new Error('Error fetching user')
        }
      },

      userAppoinments : async (id) => {
        try {
          return await userRepository.userAppoinments(id)
        } catch (error) {
          throw new Error('Error fetching appoinment')
        }
      },

      cancelAppoinment : async (id) => {
        try {
          return await userRepository.cancelAppoinment(id)
        } catch (error) {
          throw new Error('Error cancelling appoinment')
        }
      },

      getUserChatEssentials  : async (chatId) => {
        try {
          const booking = await userRepository.findAppointmentById(chatId);
          if (booking) {
            const doctor = await userRepository.findBookingDoctorById(booking.doctor);
            if (doctor) {
              const user = await userRepository.findUserById(booking.user);
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

      prescriptions : async (id) => {
        try {
          return await userRepository.prescriptions(id)
        } catch (error) {
          throw new Error(' error fetching prescription data');
        }
      }
      
}

module.exports = userUsecases;