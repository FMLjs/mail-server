const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
const fetch = require("node-fetch");
require('dotenv').config()


const clientId = '3a59134e661f4dfa9863e9c825e0d509';
const clientSecret = 'ceb50b1df89b43bf969c90d7464486d3';

const getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
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

app.get('/token', (req, res) => {
    const token = await(getToken());
    res.send(token);
})

app.get('/song/:track', async (req, res) => {
    const token = await (getToken());
    const songs = await getTrack(token, req.params.track);
    res.send(songs);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const getTrack = async (token, track) => {

    const result = await fetch(`https://api.spotify.com/v1/search?q=track:${track}&type=track`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    let values = [];
    data.tracks.items.forEach(element => {
        const a = {
            name: element.artists[0].name,
            trackName: element.name,
            images: element.album.images,
            uri: element.uri
        }
        values.push(a);
    });
    return values;
}

