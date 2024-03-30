const Doctor = require('../entities/doctorModels')
const User = require('../entities/userModels')
const Schedule = require('../entities/scheduleModel')
const Appoinment = require('../entities/appoinmentModel')
const Departments = require('../entities/departmentModel')
const { dateTime} =require('../services/dateAndTime')

const userRepository = {
    findByEmail : async (email)=>{
        return await User.findOne({email});
    },

    createUser : async (userData) => {
      console.log("data comming 3:",userData);
      console.log("user data last....",userData);
        return await User.create(userData)
    },

    updateUser: async (email) => {
        const userData = await User.findOneAndUpdate(
          { email },
          { $set: { otp: "", isVerified: true } }, 
          { new: true }
        );
        return userData;
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
        return Departments.find({})
      },

      saveUser : async (user) => {
        await user.save();
      },

      resetPassword : async (email, password) => {
        console.log('comming data:',email, password);
        const user = await User.findOneAndUpdate({email : email},{$set : {password:password}},{ new: true } )
        return user;
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
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { documents: deleteData } }
    )
    const userData = await User.find({ _id: id }, { password: 0 });
    return userData
    },

      getUserById : async (id) => {
        return User.find({_id : id});
    },

      getScheduleByDoctorId : async (docId) => {
        return await Schedule.find({ doctor: docId }, { _id: 0, doctor: 0 })
      },

      getAppointmentsByDoctorId : async (docId) => {
        return await Appoinment.find({ doctor: docId },{ date: 1, time: 1 })
      },

      deteteOldSlot : async (date) => {
        await Schedule.deleteOne({ date : date })
      },

      checkSlot : async (doctor, time, day) => {
        return await Appoinment.find({doctor:doctor,date:day,time:time})
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
        return await User.findById(id)
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
        const appoinment = await Appoinment.findByIdAndUpdate(
          {_id : id},
          { $set: { isCancelled: true } },
          { new: true }
          )
          return appoinment;
      },

      findAppointmentById  : async (appointmentId) => {
        return await Appoinment.findById(appointmentId);
      },

      findUserById : async (userId) => {
        return await User.findById(userId);
      },

      findBookingDoctorById : async (doctorId) => {
        return await Doctor.findById(doctorId);
      },

      prescriptions : async (id) => {
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
      }
}

module.exports = userRepository;