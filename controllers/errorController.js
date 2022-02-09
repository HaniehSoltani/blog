exports.get404 = (req, res, next) => {
    res.render("errors/404", {
        pageTitle: "صفحه یافت نشد | 404",
        path: "/404",
    });
};

exports.get500 = (req, res, next) => {
    res.render("errors/500", {
        pageTitle: "خطای سرور | 500",
        path: "/500",
    });
};