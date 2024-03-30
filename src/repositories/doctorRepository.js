const Department = require('../entities/departmentModel')
const Doctor = require('../entities/doctorModels')
const Schedule = require('../entities/scheduleModel')
const Appointment = require('../entities/appoinmentModel')
const User = require('../entities/userModels')

const doctorRepository = {

    findDoctorByEmail : async (email) => {
        const doctorData = await Doctor.findOne({email});
        return doctorData;
    },

    getDoctorById : async (id) => {
        return Doctor.find({_id : id});
    },

    createDoctor : async (doctorDetails) => {
        return await Doctor.create(doctorDetails);
    },

    saveUser : async (doctor) => {
        await doctor.save();
      },

    resetPassword : async (email, password) => {
        console.log('comming data:',email, password);
        const user = await Doctor.findOneAndUpdate({email : email},{$set : {password:password}},{ new: true } )
        return user;
    },

    updateData : async (email) => {
        const doctorData = await Doctor.findOneAndUpdate(
            { email },
            { $set: { otp: "", isVerified: true } }, 
            { new: true }
          );
          return doctorData;
    },

    updateDoctorOTP : async (email , otp) => {
        try {
            const doctor = await Doctor.findOneAndUpdate(
                { email: email },
                { otp: otp },
                { new: true } // Return the updated record
              );
              if (!doctor) {
                throw new Error('Doctor not found');
              }
              return doctor;
        } catch (error) {
            console.error('Error updating doctor OTP:', error);
            throw new Error('Failed to update doctor OTP');
        }
    },

    departments : async () => {
        try {
            return Department.find({isBlocked: false})
        } catch (error) {
            throw new Error("Failed to fetch departments");
        }
    },

    deleteDocument : async (deleteData, doctorId) => {
        try {
            console.log('delete data 3:',deleteData);
            const doctor = await Doctor.findOneAndUpdate(
                { _id: doctorId },
                { $pull: { documents: deleteData } }
            )
            const docData = await Doctor.find({ _id: doctorId }, { password: 0 });
            return docData
        } catch (error) {
            throw new Error("Error deleting document");
        }
    },

    updateDoctorProfile : async (id, profileData) => {
        try {
            console.log("3rd nd........",profileData );
            console.log("id.......",id );

            const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: profileData }, { new: true });
            console.log("updated 4 th data.....",updatedDoctor);
            return updatedDoctor;
          } catch (error) {
            console.log("error is....",error);
          }
    },

    findScheduleByDoctorAndDate : async (doctorId, date) => {
        return Schedule.findOne({doctor : doctorId, date:date})
    },

    updateSchedule: async (doctorId, date, time) => {
        try {
            const updatedSchedule = await Schedule.findOneAndUpdate(
                { doctor: doctorId, date: date },
                { $set: { time: time } },
                { new: true } 
            );
            return updatedSchedule;
        } catch (error) {
            throw new Error('Error updating doctor schedule');
        }
    },

    createSchedule : async (doctorId, date, time) => {
        const schedule = new Schedule({ 
            doctor: doctorId, 
            date, 
            time
        });
        await schedule.save();
    },

    deleteSchedule : async (doctorId, date) => {
        await Schedule.deleteOne({ doctor: doctorId, date : date });
    },

    removeSchedule : async (doctorId, date, time) => {
        console.log("comming data 4:",date, time);
        await Schedule.findOneAndUpdate(
            {doctor: doctorId, date : date},
            {$pull : {time : time}}
        );
    },

    findScheduleByDoctor : async (doctorId) => {
        return await Schedule.find({doctor: doctorId })
    },

    getSchedule : async (doctorId) => {
        return await Schedule.find({ doctor: doctorId }).sort({date:1})
    },

    doctorAppoinments : async (id) => {
        const appoinmnet =  await Appointment.aggregate([
            {
                $match: { doctor: id },
              },
              {
                $lookup: {
                  from: "users",
                  let: { searchId: { $toObjectId: "$user" } },
                  pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$searchId"] } } }],
                  as: "userData",
                },
              },
              {
                $sort: { date: -1, time: 1 },
              }, 
        ])
        return appoinmnet
    },

    consult : async (id) => {
        const appointment = await Appointment.aggregate([
            {
              $match: { doctor: id},
            },
            {
              $lookup: {
                from: "users",
                let: { searchId: { $toObjectId: "$user" } },
                pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$searchId"] } } }],
                as: "userData",
              },
            },
            {
              // $sort: { date: -1, time: 1 },
              $sort: { isAttended:1  },
            },
          ]);
          return appointment
    },

    endAppointment : async ( id) => {
        const deleteAppoinment = await Appointment.findOneAndUpdate({_id: id},{ isAttended: true })
        return deleteAppoinment
    },

    findAppointmentByUserId : async (userId) => {
        return await Appointment.findOne({ user: userId });
      },

      findBookingDoctorById : async (doctorId) => {
        return await Doctor.findById(doctorId);
      },

      findUserById : async (userId) => {
        return await User.findById(userId);
      },

      updateAppointment : async (appointmentId, updateData) => {
        try {
            await Appointment.findOneAndUpdate({ _id: appointmentId }, { $set: updateData }, { new: true });
          } catch (error) {
            throw new Error('Error updating appointment');
          }
      }

    
}

module.exports = doctorRepository;