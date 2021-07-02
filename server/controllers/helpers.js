import qs from 'qs';
import { spotifyApi } from './spotifyApi.js';
import axios from 'axios';

const sortTracks = function (tracks) {
    const map = new Map();
    // todo Figure out a different schema to return track data in
    for (let trackInfo of tracks) {
        let utcDate = new Date(trackInfo.added_at).toUTCString();
        trackInfo.added_at = utcDate;
        map.set(utcDate, trackInfo);
    }
    const sorted = new Map([...map].sort((a, b) => a - b));
    const sortedObj = Object.fromEntries(sorted);
    console.log(sortedObj);
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

export {
    sortTracks,
    retrievePlaylistTracks,
    retrieveTracksAnalysis,
    getPlaylistsArr,
    requestAccessAndRefreshTokens,
};
