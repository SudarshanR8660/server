// const  {userModel} =require("../models/userModel")
// const express = require('express');
// const router = express.Router();
// const { comparePassword, hashPassword } =require ("../helpers/authHelper")
// const JWT = require('jsonwebtoken');
// // const {}=require('../middlewares/user')


// const registerController = async (req, res) => {
//     try {
//       const { name, email, password,cpassword } = req.body;
//       //validations
      
//       if (!name) {
//         return res.send({ message: "Name is required" });
//       }
//       if (!email) {
//         return res.send({ message: "Email is Required" });
//       }
//       if (!password) {
//         return res.send({ message: "Password is Required" });
//       }
//       if (!cpassword) {
//         return res.send({ error: "Name is Required" });
//       }
      
     
      
//       //check user
//       const exisitingUser = await userModel.findOne({ email });
      
//       //exisiting user
//       if (exisitingUser) {
//         return res.status(200).send({
//           success: false,
//           message: "Already Register please login",
//         });
//       }
//       //register user
//       const hashedPassword = await hashPassword(password);
//       //save
//       const user = await new userModel({
//        name,
//         email,
    
        
//         password:hashedPassword,
//         cpassword:hashedPassword,
        
    
//       }).save();
  
//       res.status(201).send({
//         success: true,
//         message: "User Register Successfully",
//         user,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         message: "Errro in Registeration",
//         error,
//       });
//     }
//   };





// const loginController = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Validation
//       if (!email || !password) {
//         return res.status(400).send({
//           success: false,
//           message: 'Invalid email or password',
//         });
//       }
  
//       // Check user
//       const user = await userModel.findOne({ email });
//       if (!user) {
//         return res.status(404).send({
//           success: false,
//           message: 'Email is not registered',
//         });
//       }
  
//       // Check password
//       const match = await comparePassword(password, user.password);
//       if (!match) {
//         return res.status(401).send({
//           success: false,
//           message: 'Invalid Password',
//         });
//       }
  
//       // Generate token
//     //   console.log(process.env.JWT_SECRET);

//       const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '7d',
//       });
      
  
//       // Send response without password
//       res.status(200).send({
//         success: true,
//         message: 'Login successful',
//         user: {
//           _id: user._id,
//           email: user.email,
//           name: user.name,
          

  
//         },
//         token,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({
//         success: false,
//         message: 'Error in login. Please try again later.',
//       });
//     }
//   };


//   // manage data


//   // const updateController = async (req, res) => {
//   //   const { fName, sName } = req.body;
  
//   //   try {
//   //     // Assuming you have a User model with findByIdAndUpdate method
//   //     const updatedUser = await User.findByIdAndUpdate(req.user.id, { fName, sName }, { new: true });
  
//   //     // Send the updated user data as a response
//   //     res.json(updatedUser);
//   //   } catch (error) {
//   //     console.error('Error updating user:', error);
//   //     res.status(500).send('Internal Server Error');
//   //   }
//   // };
  

//   // const updateController = async (req, res) => {
//   //   try {
//   //     if (!req.user || !req.user.id) {
//   //       throw new Error('User not authenticated');
//   //     }
  
//   //     const { fName, sName } = req.body;
  
//   //     // Assuming you have a User model with findByIdAndUpdate method
//   //     const updatedUser = await User.findByIdAndUpdate(req.user.id, { fName, sName }, { new: true });
  
//   //     // Send the updated user data as a response
//   //     res.json(updatedUser);
//   //   } catch (error) {
//   //     console.error('Error updating user:', error);
//   //     res.status(500).send('Internal Server Error');
//   //   }
//   // };
  

//   ;
  
//   module.exports = { registerController, loginController };


const { userModel } = require("../models/userModel");
const express = require('express');
const router = express.Router();
const { comparePassword, hashPassword } = require("../helpers/authHelper");
const JWT = require('jsonwebtoken');

const registerController = async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    // Validations
    if (!name || !email || !password || !cpassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Additional validations (e.g., email format, password strength)

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: false, message: "User already registered. Please login." });
    }

    // Hash passwords
    const hashedPassword = await hashPassword(password);

    // Save user to the database
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword,
    }).save();

    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email is not registered' });
    }

    // Check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send response without password
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { _id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error in login. Please try again later.' });
  }
};

module.exports = { registerController, loginController };

  