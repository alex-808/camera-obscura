import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import qs from 'qs';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Request recieved');
});

app.get('/login', (req, res) => {
    const scopes = 'playlist-read-private user-read-private user-read-email';
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

app.get('/redirect', async (req, res) => {
    const tokens = await requestAccessAndRefreshTokens(req.query.code);
    spotifyApi.setAccessToken(tokens.access_token);

    let playlistArr = [];
    const limit = 50;
    let playlists = await spotifyApi.getUserPlaylists({
        limit: limit,
    });
    let { offset } = playlists.body;

    playlistArr = [...playlistArr, ...playlists.body.items];

    while (playlists.body.next) {
        playlists = await spotifyApi.getUserPlaylists({
            limit: limit,
            offset: offset + limit,
        });
        offset = playlists.body.offset;
        playlistArr = [...playlistArr, ...playlists.body.items];
    }

    for (const playlist of playlistArr) {
        console.log(playlist.name);
    }
    console.log(playlistArr.length);
    res.body = playlistArr;
    res.redirect('http://localhost:3000');
});

const requestAccessAndRefreshTokens = async function (code) {
    const tokens = await axios({
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
        },
    });

    return tokens.data;
};

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
