import { spotifyApi } from './spotifyApi.js';
import axios from 'axios';
import qs from 'qs';

export const login = (req, res) => {
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
};

export const logout = (req, res) => {
    // spotifyApi.setRefreshToken('');
    spotifyApi.setAccessToken('');

    res.send('Logged out');
};

export const postPlaylists = async (req, res) => {
    const selectedPlaylists = req.body;

    let allTracks = [];

    for (let playlist of selectedPlaylists) {
        const playlistTracks = await spotifyApi.getPlaylistTracks(playlist);
        const tracks = playlistTracks.body.items;
        allTracks = [...allTracks, ...tracks];
    }

    const sorted = sortTracks(allTracks);
    res.send({ sorted });
};

const sortTracks = function (tracks) {
    const map = new Map();

    for (let trackInfo of tracks) {
        map.set(trackInfo.added_at, trackInfo);
    }

    const sorted = new Map([...map].sort((a, b) => a - b));
    const sortedObj = Object.fromEntries(sorted);
    return sortedObj;
};

export const getPlaylists = async (req, res) => {
    try {
        const playlists = await getPlaylistsArr();
        console.log('Sending playlists');
        res.json(playlists);
    } catch (error) {
        console.log(error);
        if (error.body.error.status === 401) {
            res.redirect('/refresh');
        }
    }
};

const getPlaylistsArr = async function () {
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

export const getRedirect = async (req, res) => {
    const tokens = await requestAccessAndRefreshTokens(req.query.code);
    spotifyApi.setAccessToken(tokens.access_token);
    spotifyApi.setRefreshToken(tokens.refresh_token);

    res.redirect('http://localhost:3000/home');
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

export const getRefreshAccessToken = async function (req, res) {
    try {
        const refreshToken = spotifyApi.getRefreshToken();
        console.log('Refresh token:', refreshToken);
        const response = await axios({
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
        const { access_token: accessToken } = response.data;
        spotifyApi.setAccessToken(accessToken);
        console.log('Access token refreshed');
        res.redirect('/playlists');
    } catch (error) {
        console.log(error);
        console.log('Refresh failed');
    }
};
