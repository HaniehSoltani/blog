const passport = require('passport');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { sendEmail } = require('../utils/mailer');

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error")
    });
};

exports.handleLogin = async (req, res, next) => {
    if(!req.body["g-recaptcha-response"]) {
        req.flash("error", "اعتبارسنجی captcha الزامی میباشد");
        return res.redirect("/users/login");
    }

    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
        &remoteip=${req.connection.remoteAddress}`;
    
    const response = await fetch(verifyUrl, {
        method: "POST",
        Headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
    });

    const json = await response.json();
    if(json.success) {
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);
    }else {
        req.flash("error", "مشکلی در اعتبارسنجی captcha هست");
        res.redirect("/users/login");
    }
};

exports.rememberMe = (req, res) => {
    if(req.body.remember) {
        req.session.cookie.orginalMaxAge = 24 * 60 * 60 * 60 * 1000;
    }else {
        req.session.cookie.expire = null;
    }

    return res.redirect("/dashboard");
};

exports.logout = (req, res) => {
    req.session = null;
    req.logout();
    res.redirect("/users/login");
};

exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر",
        path: "/register"
    });
};

exports.createUser = async (req, res) => {
    const errors = [];

    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await User.findOne({email});
        if(user) {
            errors.push({
                message: "کاربری با این ایمیل موجود است"
            });

            res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors
            });
        }

        await User.create({ fullname, email, password });
        sendEmail(
            email,
            fullname,
            "به بلاگ ما خوش آمدین",
            "خیلی خوشحالیم که عضویی از بلاگ ما شدید"
        );

        req.flash("success_msg", "ثبت نام موفقیت آمیز بود");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEarch((e) => {
            errors.push({
                name: e.path,
                message: e.message
            });
        });

        res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register",
            errors
        });
    }
};

exports.forgetPasswrod = async (req, res) => {
    res.render("forgetPass", {
        pageTitle: "فراموشی رمزعبور",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error")
    });
};

exports.handleForgetPassword = async (req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email });
    if(!user) {
        req.flash("error", "کاربری با این ایمیل در پایگاه داده ثبت نشده است");
        res.render("forgetPass", {
            pageTitle: "فراموشی رمزعبور",
            path: "/login",
            message: req.flash("success_msg"),
            error: req.flash("error")
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
    
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;
    sendEmail(
        user.email,
        user.fullname,
        "فراموشی رمزعبور",
        `برای تغییر رمزعبور روی لینک زیر کلیک کنید:
            <br/>
            <a href=${resetLink}> لینک تغییر رمزعبور </a>`
    );

    req.flash("success_msg", "ایمیل حاوی لینک تغییر رمزعبور با موفقیت ارسال شد");
    res.render("forgetPass", {
        pageTitle: "فراموشی رمزعبور",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error")
    });
};

exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
    } catch (err) {
        if(!decodedToken) {
            return res.redirect("/404");
        }
    }

    res.render("resetPass", {
        pageTitle: "تغییر پسورد",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        userId: decodedToken.userId
    });
};

exports.handleResetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    console.log(password, confirmPassword);

    if(password != confirmPassword) {
        req.flash("error", "کلمه های عبور یکسان نیستند");
        res.render("resetPass", {
            pageTitle: "تغییر پسورد",
            path: "/login",
            message: req.flash("success_msg"),
            error: req.flash("error"),
            userId: req.params.id
        });
    }

    const user = await User.findOne({ _id: req.params.id });
    if(!user) {
        return res.redirect("/404");
    }

    user.password = password;
    await user.save();

    req.flash("success_msg", "پسورد شما با موفقیت برروزرسانی شد");
    res.redirect("/users/login");
};