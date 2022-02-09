const Yup = require('yup');
const captchapng = require('captchapng');

const Blog = require('../model/Blog');
const { truncate } = require('../utils/helper');
const { formatDate } = require('../utils/jalali');
const { sendEmail } = require('../utils/mailer');
const { get500, get404 } = require('./errorController');
;

let CAPTCHA_NUM;

exports.getIndex = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 3;

    try {
        const numberOfPosts = await Blog.find({
            status: "public"
        }).countDocuments();

        const posts = await Blog.find({
            status: "public"
        }).sort({
            createdAt: "desc"
        }).skip((page - 1) * postPerPage)
        .limit(postPerPage);

        res.render("index", {
            pageTitle: "وبلاگ",
            path: "/",
            posts,
            formatDate,
            truncate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage)
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate(
            "user"
        );

        if(!post)   return get404(req, res);
        res.render("post", {
            pageTitle: post.title,
            path: "/post",
            post,
            formatDate
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};

exports.getContactPage = (req, res) => {
    res.render("contact", {
        pageTitle: "تماس با ما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: []
    });
};

exports.handleContactPage = async (req, res) => {
    const errorArr = [];

    const { fullname, email, message, captcha } = req.body;
    const schema = Yup.object().shape({
        fullname: Yup.string()
            .required("نام و نام خانوادگی الزامی میباشد"),
        email: Yup.string()
            .email("آدرس ایمیل درست نمیباشد")
            .required("آدرس ایمیل الزامی میباشد"),
        message: Yup.string()
            .required("پیام اصلی الزامی میباشد")
    });

    try {
        await schema.validate(body, { abortEarly: false });
        if(parseInt(captcha) === CAPTCHA_NUM) {
            sendEmail(
                email,
                fullname,
                "پیامی از طرف بلاگ",
                `${message} <br/> ایمیل کاربر: ${email}`
            );

            req.flash("success_msg", "پیام شما با موفقیت ارسال شد");
            res.render("contact", {
                pageTitle: "تماس با ما",
                path: "/contact",
                message: req.flash("success_msg"),
                error: req.flash("error"),
                errors: errorArr
            });
        }

        req.flash("success_msg", "کد امنیتی صحیح نمیباشد");
        res.render("contact", {
            pageTitle: "تماس با ما",
            path: "/contact",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            errors: errorArr
        });
    } catch (err) {
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message
            });
        });

        res.render("contact", {
            pageTitle: "تماس با ما",
            path: "/contact",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            errors: errorArr
        });
    }
};

exports.getCaptcha = (req, res) => {
    CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    const img = p.getBase64();
    const imgBase64 = Buffer.from(img, "base64");
    res.send(imgBase64);
};

exports.handleSearch = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 3;

    try {
        const numberOfPosts = await Blog.find({
            status: "public",
            $text: { $search: req.body.search }
        }).countDocuments();

        const posts = await Blog.find({
            status: "public",
            $text: { $search: req.body.search }
        }).sort((page - 1) * postPerPage)
        .limit(postPerPage);

        res.render("index", {
            pageTitle: "نتایج جستوجوی شما",
            path: "/",
            posts,
            formatDate,
            truncate,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage)
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
};