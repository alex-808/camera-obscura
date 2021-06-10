import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import qs from 'qs';
import bodyParser from 'body-parser';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

const app = express();

app.use(cors());
app.use(bodyParser());

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

const refreshAccessToken = async function () {
    try {
        const refreshToken = spotifyApi.getRefreshToken();
        console.log('Refresh token:', refreshToken);
        const res = await axios({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            data: qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token: accessToken } = res.data;
        spotifyApi.setAccessToken(accessToken);
        console.log('Access token refreshed');
    } catch (error) {
        console.log('Refresh failed');
    }
};

app.get('/redirect', async (req, res) => {
    const tokens = await requestAccessAndRefreshTokens(req.query.code);
    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi.setRefreshToken(tokens.refresh_token);
    console.log(tokens.refresh_token);
    console.log(spotifyApi.getRefreshToken());

    res.redirect('http://localhost:3000/playlists');
});

app.get('/playlists', async (req, res) => {
    try {
        const playlists = await getPlaylists();
        console.log('Sending playlists');
        res.json(playlists);
    } catch (error) {
        console.log(error.body.error.status);
        console.log(error.body.error);
        if (error.body.error.status === 401) refreshAccessToken();
    }
});

app.post('/playlists', async (req, res) => {
    const selectedPlaylists = req.body;

    for (let playlist of selectedPlaylists) {
        const playlistTracks = await spotifyApi.getPlaylistTracks(playlist);
        console.log(playlistTracks);
    }
});

app.get('/logout', (req, res) => {
    // spotifyApi.setRefreshToken();
    spotifyApi.setAccessToken('');

    res.send('Logged out');
});

// ! I want to generalize this function to also be able to retrieve tracks from a playlist
const getPlaylists = async function () {
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

    return playlistArr;
};

const getPlaylistTracks = async function (playlistId) {
    const tracks = await spotifyApi.getPlaylistTracks(playlistId);
    console.log(tracks);
    return tracks;
};

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
