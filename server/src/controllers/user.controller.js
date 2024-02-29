const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const createToken = (_id) => {
   const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
   return jwt.sign({ _id }, JWT_SECRET_KEY, { expiresIn: '3d' });
};
class UserController {
   registerUser = async (req, res) => {
      try {
         const { name, username, email, password } = req.body;
         if (!name || !username || !email || !password) {
            return res.status(400).json({
               success: false,
               message: 'Missing required fields',
            });
         }

         const userIsExists = await UserModel.findOne({
            $or: [{ email }, { username }],
         });
         if (userIsExists) {
            return res.status(400).json({
               success: false,
               message: 'User already exists',
            });
         }

         if (!validator.isEmail(email)) {
            return res.status(400).json({
               success: false,
               message: 'Invalid email',
            });
         }
         // if (!validator.isStrongPassword(password)) {
         //    return res.status(400).json({
         //       success: false,
         //       message: 'Password not strong enough',
         //    });
         // }

         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         const newUser = await UserModel.create({
            name,
            username,
            email,
            password: hashedPassword,
         });

         const token = createToken(newUser._id);

         newUser.password = undefined;
         return res.status(201).json({
            success: true,
            token,
            metadata: newUser,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };

   loginUser = async (req, res) => {
      try {
         const { email, password } = req.body;
         if (!email || !password) {
            return res.status(400).json({
               success: false,
               message: 'Missing required fields',
            });
         }

         const user = await UserModel.findOne({ email });
         if (!user) {
            return res.status(400).json({
               success: false,
               message: 'Invalid credentials',
            });
         }

         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res.status(400).json({
               success: false,
               message: 'Invalid credentials',
            });
         }

         const token = createToken(user._id);
         // Exclude password
         user.password = undefined;
         return res.status(200).json({
            success: true,
            token,
            metadata: user,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };

   getUser = async (req, res) => {
      try {
         const userId = req?.user?._id ?? req.params.userId;

         const user = await UserModel.findById(userId);
         if (!user) {
            return res.status(404).json({
               success: false,
               message: 'User not found',
            });
         }
         user.password = undefined;
         return res.status(200).json({
            success: true,
            metadata: user,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };

   getAllUser = async (req, res) => {
      try {
         const user = await UserModel.find();
         return res.status(200).json({
            success: true,
            metadata: user,
         });
      } catch (error) {
         console.error(error);
         res.status(500).json({
            success: false,
            message: 'Internal server error',
         });
      }
   };
}

module.exports = new UserController();
