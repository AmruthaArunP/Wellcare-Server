const User = require('../entities/userModels')

const authUser = async (req, res, next) => {
    try {
      const id = req._id.id;
      const Data = await User.findOne({ _id: id });
      //console.log('user auth:',Data);
  
      if (!Data) {
        // Handle the case where the user with the provided ID is not found
        return res.status(404).json({ error: "User not found" });
      }
  
      if (Data.isBlocked) {
        return res.json("blocked");
      }
  
      next();
    } catch (error) {
      // Handle any other errors that may occur during the execution
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  module.exports = {
      authUser
  }