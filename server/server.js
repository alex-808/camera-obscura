import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import qs from 'qs';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

const app = express();

app.get('/', (req, res) => {
    res.send('Request recieved');
});

app.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email';
    res.redirect(
        'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' +
            process.env.CLIENT_ID +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' +
            encodeURIComponent(process.env.REDIRECT_URI)
    );
});

app.get('/redirect', (req, res) => {
    requestAccessAndRefreshTokens(req.query.code);
    res.send();
});

const requestAccessAndRefreshTokens = function (code) {
    axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            // Authorization: 'Basic ' + base64,
        },
    }).then((res) => console.log(res.data));
};
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
