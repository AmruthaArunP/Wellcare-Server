const { sign, verify } = require("jsonwebtoken");

const createTokens = (user , role) => {
  console.log('role in create function:',role);
  const accessToken = sign({ id: user , role:role }, process.env.JWT_SECRET);
  return accessToken;
};

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Validate user - token is:*******",authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json("unauthorized");
        // return res.status(401).json({ message: "Unauthorized" });
      }else{
        // req._id = decoded;
        req.userRole = decoded.role; // decoded contains id and role
        req._id = decoded // Assigning user ID to req._id
        next();
      }
    });
  } else {
    
    res.json("unauthorized");
  }
};



const createDoctorTokens = (user, role) => {
  const accessToken = sign({ id: user, role:role }, process.env.JWT_SECRET);
  return accessToken;
};

const validateDoctorToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Validate doctor - token is :",authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json("unauthorized");
      }else{
        req.userRole = decoded.role;
        req._id = decoded;
        next();
      }

    });
  } else {
    res.json("unauthorized");
  }
};

const createAdminTokens = (user, role) => {
  const accessToken = sign({ id: user, role:role }, process.env.JWT_SECRET);
  return accessToken;
};

const validateAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("entered data is:",authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json("unauthorized");
      }
      req.userRole = decoded.role;
      req._id = decoded;
      next();
    });
  } else {
    res.json("unauthorized");
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    console.log('role in autherized function:',role);
      if (req.userRole !== role) {
          return res.status(403).send('Access denied. You do not have the necessary role.');
      }
      next();
  };
};

module.exports = {
    createTokens,
    validateToken,
    authorizeRole,
    createDoctorTokens,
    validateDoctorToken,
    createAdminTokens,
    validateAdminToken
}