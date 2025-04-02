// server/controllers/authController.js
const getCurrentUserEmail = (req, res) => {
    // Logic to get the current user's email
    const userEmail = "testuser5@gmail.com";
    res.json({ email: userEmail });
  };
  
  module.exports = { getCurrentUserEmail };