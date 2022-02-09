const { Router } = require('express');

const blogController = require('../controllers/blogController');
const router = Router();

//!  @desc   Weblog Index Page
//TODO @route GET /
router.get("/", blogController.getIndex);

//! @desc   Weblog Post Page
//TODO @route GET /post/:id
router.get("/post/:id", blogController.getSinglePost);

//!  @desc   Weblog Contact Page
//TODO  @route  GET /contact
router.get("/contact", blogController.getContactPage);

//!  @desc   Weblog Numric Captcha
//TODO  @route  GET /captcha.png
router.get("/captcha.png", blogController.getCaptcha);

//!  @desc   Handle Contact Page
//TODO  @route  POST /contact
router.post("/contact", blogController.handleContactPage);

//!  @desc   Handle Search
//TODO  @route  POST /search
router.post("/search", blogController.handleSearch);

module.exports = router;