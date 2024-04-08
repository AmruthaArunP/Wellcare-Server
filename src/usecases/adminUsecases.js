const {createAdminTokens} = require('../middlewares/jwt')
const adminRepository = require('../repositories/adminRepository');
const userRepository = require('../repositories/userRepository');
const { dateTime } = require('../services/dateAndTime');
require('dotenv').config();

const adminEmail = process.env.ADMIN_EMAIL
const adminPassword = process.env.ADMIN_PASSWORD

const adminUsecases = {
    login : async (email , password) => {
        try {
            const adminData= {
                email : adminEmail,
                password : adminPassword
            };
            if(email === adminData.email && password === adminData.password){
                const adminToken = createAdminTokens(adminData._id , 'admin');
                console.log(adminToken);
                return { adminToken}
            }else{
                return {error : 'invalid credentials'}
            }
        } catch (error) {
            console.error(error);
            return { error: "An error occurred" };
        }
    },
    getPatients : async () => {
        try {
            return await adminRepository.getAllPatients();
        } catch (error) {
            throw new Error("Failed to fetch patients");
        }
    } ,

    managePatient : async (id, status) => {
        try {
            const result = await adminRepository.blockUnblockPatient(id, status);
            return result;
        } catch (error) {
            throw new Error("Error managing Patient");
        }
    },

    findDoctors : async (req, res) => {
        try {
            const doctors = await adminRepository.getAllDoctors();
            return doctors;
        } catch (error) {
            throw new Error("Failed to fetch Doctors");
        }
    },

    manageDoctor : async (id, status) => {
        try {
            const doctor = await adminRepository.blockUnblockDoctor(id, status);
            return doctor;
        } catch (error) {
            throw new Error("Error managing doctor");
        }
    },

    approveDoctor: async (id, status, reasonText) => {
        try {
          return await adminRepository.approveDoctor(id, status, reasonText);
        } catch (error) {
          console.error('Error Approving doctors:', error);
          throw error;
        }
      },

    createDep : async (name, image) => {
        try {
            const existingDepartment = await adminRepository.findDepartment(name)
            console.log("existing ......",existingDepartment);
            if(existingDepartment){
                return {error : "Department is already exist"}
            }else{
                const departmentDetails = {
                    name : name,
                    image: image,
                    timeStamp : dateTime
                }
                const createDepartment = await adminRepository.createDepartment(departmentDetails)
                return createDepartment
            }
        } catch (error) {
            throw new Error("Failed to create department");
        }
    },

    getDepartments : async () => {
        try {
            return await adminRepository.getDepartments();
        } catch (error) {
            throw new Error("Failed to fetch departments");
        }
    },

    manageDepartment : async (id, status) => {
        try {
            const result = await adminRepository.manageDepartment(id, status)
            console.log('status usecase.....',result);
            return result;
        } catch (error) {
            throw new Error("Error managing department");
        }
    },

    appoints : async (req, res) => {
        try {
            return await adminRepository.appoints()
        } catch (error) {
            throw new Error("Error fetching appoinments for dashboard");
        }
    }
}

module.exports = adminUsecases;