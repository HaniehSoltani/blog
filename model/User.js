const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { schema } = require('./secure/userValidation');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "نام و نام خانوادگی الزامی میباشد"],
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.statics.userValidation = function(body) {
    return schema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function(next) {
    let user = this;

    if(!user.isModified())  return next();
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) next(err);

        user.password = hash;
        next();
    });
});

module.exports = mongoose.model("User", userSchema);