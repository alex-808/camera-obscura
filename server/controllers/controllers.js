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
        const playlistTracks = await retrievePlaylistTracks(playlist);
        allTracks = [...allTracks, ...playlistTracks];
    }
    const analysisData = await retrieveTracksAnalysis(allTracks);

    allTracks.forEach(
        (track, i) => (track.analysis_features = analysisData[i])
    );

    // console.log(allTracks);

    const sorted = sortTracks(allTracks);
    res.send({ sorted });
};

const sortTracks = function (tracks) {
    const map = new Map();
    // todo Figure out a different schema to return track data in
    for (let trackInfo of tracks) {
        map.set(trackInfo.added_at, trackInfo);
    }
    const sorted = new Map([...map].sort((a, b) => a - b));
    const sortedObj = Object.fromEntries(sorted);
    return sortedObj;
};

const retrievePlaylistTracks = async function (playlist) {
    let playlistTracks = [];
    let response = await spotifyApi.getPlaylistTracks(playlist);
    const limit = 100;
    playlistTracks = [...response.body.items];
    let offset = limit;

    while (response.body.next) {
        response = await spotifyApi.getPlaylistTracks(playlist, {
            offset: offset,
        });
        let tracks = response.body.items;
        playlistTracks = [...playlistTracks, ...tracks];
        offset += limit;
    }
    return playlistTracks;
};

const retrieveTracksAnalysis = async function (tracks) {
    const limit = 100;
    const ids = [];
    const analysisData = [];
    for (let trackInfo of tracks) {
        ids.push(trackInfo.track.id);
    }
    console.log(ids);
    console.log(ids.length);
    while (ids.length > 0) {
        const idGroup = ids.splice(0, limit);
        const response = await spotifyApi.getAudioFeaturesForTracks(idGroup);
        const audioFeatures = response.body.audio_features;
        analysisData.push(...audioFeatures);
    }

    console.log(analysisData.length);
    return analysisData;
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
