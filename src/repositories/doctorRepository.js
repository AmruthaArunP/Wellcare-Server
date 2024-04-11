const Department = require('../entities/departmentModel')
const Doctor = require('../entities/doctorModels')
const Schedule = require('../entities/scheduleModel')
const Appointment = require('../entities/appoinmentModel')
const User = require('../entities/userModels')

const doctorRepository = {

    findDoctorByEmail : async (email) => {
        try {
            const doctorData = await Doctor.findOne({email});
            return doctorData;
        } catch (error) {
            console.log("error is....",error);
        }

    },

    getDoctorById : async (id) => {
        try {
        return Doctor.find({_id : id});
        } catch (error) {
            console.log("error is....",error);
            
        }
    },

    createDoctor : async (doctorDetails) => {
        try {
        return await Doctor.create(doctorDetails);
        } catch (error) {
            console.log("error is....",error);
            
        }
    },

    saveUser : async (doctor) => {
        try {
        await doctor.save();
        } catch (error) {
            console.log("error is....",error);  
        }
      },

    resetPassword : async (email, password) => {
        try {
            console.log('comming data:',email, password);
            const user = await Doctor.findOneAndUpdate({email : email},{$set : {password:password}},{ new: true } )
            return user;
        } catch (error) {
            console.log("error is....",error);
        }

    },

    updateData : async (email) => {
        try {
            const doctorData = await Doctor.findOneAndUpdate(
                { email },
                { $set: { otp: "", isVerified: true } }, 
                { new: true }
              );
              return doctorData;
        } catch (error) {
            console.log('comming data:',email, password);
            const user = await Doctor.findOneAndUpdate({email : email},{$set : {password:password}},{ new: true } )
            return user;
        }

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
            //console.log("id.......",id );

            const updatedDoctor = await Doctor.findByIdAndUpdate(id, { $set: profileData }, { new: true });
            console.log("updated 4 th data.....",updatedDoctor);
            return updatedDoctor;
          } catch (error) {
            console.log("error is....",error);
          }
    },

    findScheduleByDoctorAndDate : async (doctorId, date) => {
        try {
        return Schedule.findOne({doctor : doctorId, date:date})
        } catch (error) {
            console.log("error is....",error);
        }
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
        try {
        await Schedule.deleteOne({ doctor: doctorId, date : date });
        } catch (error) {
            console.log("error is....",error);
        }
    },

    removeSchedule : async (doctorId, date, time) => {
        console.log("comming data 4:",date, time);
        await Schedule.findOneAndUpdate(
            {doctor: doctorId, date : date},
            {$pull : {time : time}}
        );
    },

    findScheduleByDoctor : async (doctorId) => {
        try {
        return await Schedule.find({doctor: doctorId })
        } catch (error) {
            console.log("error is....",error); 
        }
    },

    getSchedule : async (doctorId) => {
        try {
        return await Schedule.find({ doctor: doctorId }).sort({date:1})
        } catch (error) {
            console.log("error is....",error);
        }
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
            //   $sort: { date: -1, time: 1 },
              $sort: { isAttended:1  },
            },
          ]);
          return appointment
    },

    endAppointment : async ( id) => {
        try {
            const deleteAppoinment = await Appointment.findOneAndUpdate({_id: id},{ isAttended: true })
            return deleteAppoinment
        } catch (error) {
            console.log("error is....",error);
        }

    },

    findAppointmentByUserId : async (userId) => {
        try {
        return await Appointment.findOne({ user: userId });
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

      findUserById : async (userId) => {
        try {
        return await User.findById(userId);
        } catch (error) {
            console.log("error is....",error);
        }
      },

      updateAppointment : async (appointmentId, updateData) => {
        try {
            await Appointment.findOneAndUpdate({ _id: appointmentId }, { $set: updateData }, { new: true });
          } catch (error) {
            throw new Error('Error updating appointment');
          }
      },

      findAppointmentByDocId : async (id) => {
        try {
            return await Appointment.find({doctor : id})
        } catch (error) {
            throw new Error('Error fetching appoinment details of doctor');
        }
      },

      prescriptions : async (id) => {
        try {
            const data = await Appointment.aggregate([
                {
                    $match: { 
                      doctor: id,
                      medicines: { $exists: true, $ne: {} } 
                    }
                  },
              {
                $lookup: {
                  from: "users",
                  let: { searchId: { $toObjectId: "$user" } },
                  pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$searchId"] } } }],
                  as: "userData",
                },
              },
            ]);
            console.log('prescription:',data);
            return data
          } catch (error) {
            console.log(error);
          }

      }

    
}

module.exports = doctorRepository;