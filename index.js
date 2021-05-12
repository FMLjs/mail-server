const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const fetch = require("node-fetch");
require('dotenv').config()
var cors = require('cors');

app.use(cors())


const getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.clientId + ':' + process.env.clientSecret).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

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

// app.get('/token', async (req, res) => {
//     const token = await (getToken());
//     res.send(token);
// })

app.get('/song/:track', async (req, res) => {
    const token = await (getToken());
    const songs = await getTrack(token, req.params.track);
    res.send(songs);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const getTrack = async (token, track) => {

    const result = await fetch(`https://api.spotify.com/v1/search?q=track:${track}&type=track&limit=8`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    let values = [];
    data.tracks.items.forEach(element => {
        const a = {
            name: element.artists[0].name,
            trackName: element.name,
            imgUrl: element.album.images[2].url,
            uri: element.uri,
            preview_url: element.preview_url
        }
        values.push(a);
    });
    return values;
}

