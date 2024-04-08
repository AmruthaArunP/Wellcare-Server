const adminUsecases = require ('../../usecases/adminUsecases')
const cloudinary = require('../../config/cloudinary')
const doctorController = require('./doctorController')


const adminController = {
    login : async (req , res) => {
        try {
            const { email , password} = req.body
            const result = await adminUsecases.login(email , password) 
            if (result.error) {
                res.status(401).json({ error: result.error });
              } else {
                const { adminToken } = result;
                console.log('token is...........',adminToken);
                res.status(200).json({ message: "Login Successfully", adminToken });
              }
        } catch (error) {
          console.error("An error occurred during login:", error);
          res.status(500).json({ error: "Internal server error" });
        }
    },
    
    findPatients: async (req, res) => {
      try {
        const patients = await adminUsecases.getPatients();
        res.status(200).json(patients); 
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    managePatient : async (req, res) => {
      try {
        const { id, status} = req.body;
        const result = await adminUsecases.managePatient(id, status);
        if(result === 'Patient blocked'){
          res.status(200).json({message:'Patient blocked succesfully'})
        }else{
          res.status(200).json({message:'Patient unblocked succesfully'})
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    findDoctors : async (req, res) => {
      try {
        
        const doctors = await adminUsecases.findDoctors();
        console.log("data is....." , doctors);
        res.status(200).json(doctors)
        
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
      }
    },

    manageDoctor : async (req, res) => {
      try {
        const { id, status } = req.body;
        //console.log("id and status....",id,status);
        const result = await adminUsecases.manageDoctor(id, status);
        if(result === 'Doctor blocked'){
          res.status(200).json({message:'Doctor blocked succesfully'})
        }else{
          res.status(200).json({message:'Doctor unblocked succesfully'})
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    approveDoctor: async (req, res) => {
      try {
        const { id } = req.params;
        const { status , reasonText } = req.body;
        console.log('status....:',status);
        const doctor = await adminUsecases.approveDoctor(id, status, reasonText);
        
        let message = '';
        if (status === 'approved') {
          message = 'Doctor Approved successfully';
        } else if (status === 'rejected') {
          message = 'Doctor Rejected successfully';
        } else {
          message = 'Invalid status provided';
        }
        
        res.status(200).json({ message, doctor });
        console.log("approved...", doctor);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    
    createDepartment : async (req, res) => {
      try {
        const { newDep} = req.body;
        const filename = req.file.filename;
        console.log(newDep,filename );
        const result = await cloudinary.uploader.upload(req.file.path)
        const image = result.url
        const imagePath = req.file.path
        const createDep = await adminUsecases.createDep(newDep , image);
        if (createDep.error) { 
          res.status(500).json({ error: createDep.error }); 
        } else {
          res.status(200).json({ message: "Success", createDep });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }, 

    departments: async (req, res) => {
      try {
        const departments = await adminUsecases.getDepartments();
        res.status(200).json(departments); 
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    manageDepartment : async (req, res) => {
      try {
        const {id, status} = req.body;
        console.log('status first comming.......',status);
        const result = await adminUsecases.manageDepartment(id, status);
        console.log("status.....",result);
        if(result === 'blocked'){
          res.json('blocked')
        }else{
          res.json('unblocked')
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    appoints : async (req, res) => {
      try {
        const data = await adminUsecases.appoints()
        res.status(200).json(data)
      } catch (error) {
        
      }
    }
}

module.exports = adminController;