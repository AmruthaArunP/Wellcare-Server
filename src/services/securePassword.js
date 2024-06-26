const bcrypt = require('bcrypt');

const securePassword = async (password) => {
    try {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
      } catch (error) {
        throw new Error('Error hashing password');
      }
}

module.exports = securePassword;