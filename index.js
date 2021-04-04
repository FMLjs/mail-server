const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
require('dotenv').config()


let mail = nodemailer.createTransport({
    service: 'gmail',
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
        text: 'https://www.dropbox.com/s/uf7fpv5iyg8ji90/dating-app-fb18573527bf442b91776b961a2c90a3-signed.apk?dl=0'
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



