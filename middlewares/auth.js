// middlewares/auth.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Adjust the path as per your project structure

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization'); // Assuming the token is in the Authorization header

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Change 'your_secret_key' to your actual secret key

    const user = await UserModel.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;


// // middlewares/auth.js
// // middlewares/auth.js
// // middlewares/auth.js
// const jwt = require('jsonwebtoken');
// const {UserModel} = require('../models/userModel');

// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token || !token.startsWith('Bearer ')) {
//     return res.status(401).json({ success: false, error: 'Unauthorized' });
//   }

//   const tokenWithoutBearer = token.split(' ')[1];
//   try {
//     const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

//     const user = await UserModel.findById(decoded.userId);

//     if (!user) {
//       return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Error in authMiddleware:', error);
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ success: false, error: 'Invalid token' });
//     }
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// };

// module.exports = authMiddleware;


