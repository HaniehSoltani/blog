const { Router } = require('express');
const { authenticated } = require('../middleware/auth');

const adminController = require('../controllers/adminController');

const router = new Router();

//!  @desc   Dashboard
//TODO  @route  GET /dashboard
router.get("/", authenticated, adminController.getDashboard);

//!  @desc   Dashboard Add Post
//TODO  @route  GET /dashboard/add-post
router.get("/add-post", authenticated, adminController.getAddPost);

//!  @desc   Dashboard Edit Post
//TODO  @route  GET /dashboard/edit-post/:id
router.get("/edit-post/:id", authenticated, adminController.getEditPost);

//!  @desc   Dashboard Delete Post
//TODO  @route  GET /dashboard/delete-post/:id
router.get("/delete-post/:id", authenticated, adminController.deletePost);

//!  @desc   Dashboard Handle Post Creation
//TODO  @route  POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//!  @desc   Dashboard Handle Post Edit
//TODO  @route  POST /dashboard/edit-post/:id
router.post("/edit-post/:id", authenticated, adminController.editPost);

//!  @desc   Dashboard Handle Image Upload
//TODO  @route  POST /dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

//!  @desc   Dashboard Handle Search
//TODO  @route  POST /dashboard/search
router.post("/search", authenticated, adminController.handleDashSearch);

module.exports = router;