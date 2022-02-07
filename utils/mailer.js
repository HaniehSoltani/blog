const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporterDetails = smtpTransport({
    host: "mail.haniehsoltani.ir",
    port: 465,
    secure: true,
    auth: {
        user: "haniehweb@haniehsoltani.ir",
        pass: "1377Hani1998"
    },
    tls: {
        rejectUnauthorized: false
    },
});

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from: "haniehweb@haniehsoltani.ir",
        to: email,
        subject: subject,
        html: `<h1> سلام ${fullname} </h1>
                <p> ${message} </p>`
    });
};