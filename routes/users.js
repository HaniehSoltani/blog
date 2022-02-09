const { Router } = require('express');
const { authenticated } = require('../middleware/auth');

const userController = require('../controllers/userController');

const router = new Router();

//!  @desc   Login Page
//TODO  @route  GET /users/login
router.get("/login", userController.login);

//!  @desc   Login Handle
//TODO  @route  POST /users/login
router.post("/login", userController.handleLogin, userController.rememberMe);

//!  @desc   Logout Handle
//TODO  @route  GET /users/logout
router.get("/logout", authenticated, userController.logout);

//!  @desc   Register Page
//TODO  @route  GET /users/register
router.get("/register", userController.register);

//!  @desc   Forget Password Page
//TODO  @route  GET /users/forget-password
router.get("/forget-password", userController.forgetPasswrod);

//!  @desc   Reset Password Page
//TODO  @route  GET /users/reset-password/:token
router.get("/reset-password/:token", userController.resetPassword);

//!  @desc   Handle Forget Password
//TODO  @route  POST /users/forget-password
router.post("/forget-password", userController.handleForgetPassword);

//!  @desc   Handle reset Password
//TODO  @route  POST /users/reset-password/:id
router.post("/reset-password/:id", userController.handleResetPassword);

//!  @desc   Register Handle
//TODO  @route  POST /users/register
router.post("/register", userController.createUser);

module.exports = router;