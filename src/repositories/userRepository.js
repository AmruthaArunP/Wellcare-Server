const Doctor = require('../entities/doctorModels')
const User = require('../entities/userModels')
const Schedule = require('../entities/scheduleModel')
const Appoinment = require('../entities/appoinmentModel')
const Departments = require('../entities/departmentModel')
const { dateTime} =require('../services/dateAndTime')

const userRepository = {
    findByEmail : async (email)=>{
      try {
        return await User.findOne({email});
      } catch (error) {
        console.log("error finding user already in db",error);
      }
    },

    createUser : async (userData) => {
      try {
        return await User.create(userData)
      } catch (error) {
        console.log("error creating new user",error);
      }
    },

    updateUser: async (email) => {
      try {
        const userData = await User.findOneAndUpdate(
          { email },
          { $set: { otp: "", isVerified: true } }, 
          { new: true }
        );
        return userData;
      } catch (error) {
        console.log("error updating user",error);

      }
      },
    
      findDoctors : async () => {
        try {
          const doctors = await Doctor.aggregate([
            {
              $match: {
                isApproved: 'approved',
                isBlocked: false,
                isVerified: true,
              },
            },
            {
              $lookup: {
                from: 'departments',
                localField: 'department',
                foreignField: '_id',
                as: 'doctorData',
              },
            }
          ])
          return doctors;
        } catch (error) {
          throw new Error('Error fetching doctors');
        }
      },

      getDoctors : async () => {
        try {
          return await Doctor.aggregate([
            {
              $match: {
                isApproved: 'approved',
                isBlocked: false,
                isVerified: true,
              },
            },
            {
              $lookup: {
                from: 'departments',
                localField: 'department',
                foreignField: '_id',
                as: 'doctorData',
              },
            },
          ])
        } catch (error) {
          throw new Error('Error in getting doctors: ' + error.message);
        }
      },

      getTotalDoctors : async (req, res) => {
        try {
          return await Doctor.countDocuments({
            isApproved: 'approved',
            isBlocked: false,
            isVerified: true,
          });
        } catch (error) {
          throw new Error('Error in getting total doctors: ' + error.message);
        }
      },

      getAllDepartments : async () => {
        try {
          return await Departments.find({ isBlocked: false });
        } catch (error) {
          throw new Error('Error in getting all departments: ' + error.message);
        }
      },

      searchDoctorByNameAndSpecialty : async (searchKey, specialty) => {
        try {
          let aggregationPipeline = [
            {
              $match: {
                isApproved: 'approved',
                isBlocked: false,
                isVerified: true,
                name: { $regex: new RegExp(`${searchKey}`, "i") },
              },
            },
            {
              $lookup: {
                from: 'departments',
                localField: 'department',
                foreignField: '_id',
                as: 'doctorData',
              },
            }
          ];
      
          if (specialty) {
            // If a specialty is provided, add a $match stage to filter doctors by specialty
            aggregationPipeline.push({
              $match: {
                "doctorData.name": specialty
              }
            });
          }
      
          const doctors = await Doctor.aggregate(aggregationPipeline);
          console.log('doctors data ======>',doctors);
          return doctors;
        } catch (error) {
          throw new Error('Error fetching doctors');
        }
      },

      searchDoctor : async (searchKey) => {
        try {
          const doctors = await Doctor.aggregate([
            {
              $match: {
                isApproved: 'approved',
                isBlocked: false,
                isVerified: true,
                name: { $regex: new RegExp(`${searchKey}`, "i") },
              },
            },
            {
              $lookup: {
                from: 'departments',
                localField: 'department',
                foreignField: '_id',
                as: 'doctorData',
              },
            }
          ])
          return doctors;
        } catch (error) {
          throw new Error('Error fetching doctors');
        }
      },


      findSpeciality : async () => {
        try {
          return Departments.find({})
        } catch (error) {
          console.log("error finding department",error);
        }
      },

      saveUser : async (user) => {
        try {
          await user.save();
        } catch (error) {
          console.log("error saving user",error);
        }
        
      },

      resetPassword : async (email, password) => {
        try {
          console.log('comming data:',email, password);
          const user = await User.findOneAndUpdate({email : email},{$set : {password:password}},{ new: true } )
          return user;
        } catch (error) {
          console.log("error is....",error);
        }

      },

      updateUserProfile : async (id, profileData) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, { $set: profileData }, { new: true });
            console.log("updated 4 th data.....",updatedUser);
            return updatedUser;
          } catch (error) {
            console.log("error is....",error);
          }
    },

    deleteData : async (deleteData, id) => {
      try {
        const user = await User.findOneAndUpdate(
          { _id: id },
          { $pull: { documents: deleteData } }
      )
      const userData = await User.find({ _id: id }, { password: 0 });
      return userData
      } catch (error) {
        console.log("error is....",error);
      }
    },

      getUserById : async (id) => {
        try {
          return User.find({_id : id});
        } catch (error) {
          console.log("error is....",error);
        }
    },

      getScheduleByDoctorId : async (docId) => {
        try {
          return await Schedule.find({ doctor: docId }, { _id: 0, doctor: 0 })
        } catch (error) {
          console.log("error is....",error);

        }
      },

      getAppointmentsByDoctorId : async (docId) => {
        try {
          return await Appoinment.find({ doctor: docId },{ date: 1, time: 1 })
        } catch (error) {
          console.log("error is....",error);
        }
      },

      deteteOldSlot : async (date) => {
        try {
          await Schedule.deleteOne({ date : date })
        } catch (error) {
          console.log("error is....",error);
        }
      },

      checkSlot : async (doctor, time, day) => {
        try {
          return await Appoinment.find({doctor:doctor,date:day,time:time})
        } catch (error) {
          console.log("error is....",error);
        }
      },

      bookSlot : async (doctor, issues, fee, user, date, time) => {
        const appointment = new Appoinment({
          doctor: doctor,
          user: user,
          date: date,
          time: time,
          issues: issues,
          amount: fee,
          createdAt: dateTime,
        })
        appointment.save();
        return appointment
      },

      userData : async (id) => {
        try {
          return await User.findById(id)
        } catch (error) {
          console.log("error is....",error);
        }
      },

      userAppoinments : async (id) => {
        const appointments = await Appoinment.aggregate([
          { $match: { user: id } },
          {
            $lookup: {
              from: "doctors",
              let: { searchId: { $toObjectId: "$doctor" } },
              pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$searchId"] } } }],
              as: "docData",
            },
          },
          {
            // $sort: { date: -1, time: 1 },
            $sort: { isAttended:1  },
          },
        ]);
        return appointments
      },

      cancelAppoinment : async (id) => {
        try {
          const appoinment = await Appoinment.findByIdAndUpdate(
            {_id : id},
            { $set: { isCancelled: true } },
            { new: true }
            )
            return appoinment;
        } catch (error) {
          console.log("error is....",error);
        }

      },

      findAppointmentById  : async (appointmentId) => {
        try {
          return await Appoinment.findById(appointmentId);
        } catch (error) {
          console.log("error is....",error);
        }
      },

      findUserById : async (userId) => {
        try {
          return await User.findById(userId);
        } catch (error) {
          console.log("error is....",error);
        }
        
      },

      findBookingDoctorById : async (doctorId) => {
        try {
          return await Doctor.findById(doctorId);
        } catch (error) {
          console.log("error is....",error);
        }
      },

      prescriptions : async (id) => {
        try {
          const data = await Appoinment.aggregate([
            {
              $match: { 
                user: id,
                medicines: { $exists: true, $ne: {} } 
              }
            },
            {
              $lookup: {
                from: "doctors",
                let: { searchId: { $toObjectId: "$doctor" } },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$searchId"] } } }],
                as: "docData",
              },
            },
          ]);
          return data;
        } catch (error) {
          console.log("error is....",error);
        }

      }
}

module.exports = userRepository;