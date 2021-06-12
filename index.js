const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const fetch = require("node-fetch");
require('dotenv').config()
var cors = require('cors');

app.use(cors())

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let mail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.pswd
    }
});

app.get('/', (req, res) => {
    res.send('Welcome');
})

app.get('/send/:email', (req, res) => {
    let mailOptions = {
        from: 'bogatorjov.s@gmail.com',
        to: req.params.email,
        subject: 'Download .apk for my application',
        text: 'https://www.dropbox.com/s/7nq1wko4ivbpfvi/app-release.apk?dl=0'
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send(info.response);
        }
    });
})


