const Doctor = require('../entities/doctorModels')
const Patient = require('../entities/userModels')
const Department = require('../entities/departmentModel')
const User = require('../entities/userModels')
const adminRepository = {
    getAllPatients: async () => {
        try {
            return User.find({}, {password:0})
        } catch (error) {
            throw new Error("Failed to fetch patients");
        }
    },

    blockUnblockPatient : async (id, status) => {
        try {
            let update;
            console.log('status blocked repo.......',status);
            if(status === false){
                update = await Patient.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: true } }
                  );
                  return "Patient blocked";
            }else{
                
                update = await Patient.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: false } }
                  );
                  return "Patient unblocked";
            }
        } catch (error) {
            throw new Error("Error while managing patient");
        }
    },

    getAllDoctors: async (req, res) => {
        try {
            const doctorData = await Doctor.aggregate([
                {
                    $match: {
                        name: { $ne: null },
                        age: { $ne: null },
                        gender: { $ne: null },
                        email: { $ne: null },
                        fee: { $ne: null },
                        address: { $ne: null },
                        contact: { $ne: null },
                        qualification: { $ne: null },
                        image: { $ne: null },
                        documents: { $ne: null }
                    }
                },
                {
                    $lookup: {
                        from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "dept",
                    },
                },
                {
                    $project: {
                        password: 0, 
                    },
                },
            ]);
    
            return doctorData;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    blockUnblockDoctor : async (id, status) => {
        try {
            let update;
            console.log('status blocked repo.......',status);
            if(status === false){
                update = await Doctor.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: true } }
                  );
                  return "Doctor blocked";
            }else{
                
                update = await Doctor.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: false } }
                  );
                  return "Doctor unblocked";
            }
        } catch (error) {
            throw new Error("Error updating dcoctor blocking status");
        }
    },

    approveDoctor: async (id, status, reasonText) => {
        try {
          let updateQuery = {};
      
          if (status === 'approved') {
            updateQuery = { $set: { isApproved: 'approved' }, blockReason: ''  };
          } else if (status === 'rejected') {
            updateQuery = { $set: { isApproved: 'rejected' }, blockReason: reasonText  };
          }
      
          const doctor = await Doctor.findByIdAndUpdate({ _id: id }, updateQuery, { new: true });
          return doctor;
        } catch (error) {
          console.error('Error Approving doctors:', error);
          throw error;
        }
      },
    

    findDepartment : async (departmentName) => {
        try {
            const existingDepartment = await Department.findOne({ name : departmentName });
            return existingDepartment; 
        } catch (error) {
            throw new Error("Failed to fetch department");
        }
    },

    createDepartment : async (departmentData) => {
        try {
            console.log(departmentData);
            const department = await Department.create(departmentData)
            const depData = await department.save();
            console.log(depData);
            return depData
        } catch (error) {
            return { error: "Failed to save department" };
        }
    },

    getDepartments: async () => {
        try {
            return Department.find({})
        } catch (error) {
            throw new Error("Failed to fetch departments");
        }
    },

    manageDepartment : async (id, status) => {
        try {
            let update;
            console.log('status blocked repo.......',status);
            if(status === false){
                update = await Department.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: true } }
                  );
                  return "blocked";
            }else{
                
                update = await Department.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: false } }
                  );
                  return "unblocked";
            }
        } catch (error) {
            throw new Error("Error updating department status");
        }
    }
}


module.exports =adminRepository;