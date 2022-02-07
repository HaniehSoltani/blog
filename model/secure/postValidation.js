const Yup = require('yup');

exports.schema = Yup.object().shape({
    title: Yup.string() 
            .required("عنوان پست الزامی میباشد")
            .min(5, "عنوان پست نباید کمتر از 5 باشد")
            .max(100, "عنوان پست نباید بیشتر از 100 کاراکتر باشد"),
    body: Yup.string()
            .required("پست جدید باید دارای محتوا باشد"),
    status: Yup.mixed().oneOf(
        ["private", "public"],
        "یکی از 2 حالت خصوصی یا عمومی را انتخاب کنید"
    ),

    thumbnail: Yup.object().shape({
        name: Yup.string()
            .required("عکس بندانگشتی الزامی میباشد"),
        size: Yup.number()
            .max(2000000, "عکس نباید بیشتر از 2 مگابایت باشد"),
        mimeType: Yup.mixed().oneOf(
            ["image/jpeg", "image/png"],
            "تنها پسوندهای png و jpeg پشتیبانی میکند"
        ),
    }),
});