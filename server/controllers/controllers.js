import { spotifyApi } from './spotifyApi.js'
import axios from 'axios'
import qs from 'qs'
import {
  sortTracks,
  retrievePlaylistTracks,
  retrieveTracksAnalysis,
  getPlaylistsArr,
  requestAccessAndRefreshTokens,
} from './helpers.js'

// todo Add appending of playlists added at the same time to the same date

export const login = (req, res) => {
  const scopes = 'playlist-read-private user-read-private user-read-email'
  res.redirect(
    'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' +
      process.env.CLIENT_ID +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(process.env.REDIRECT_URI)
  )
}

export const logout = (req, res) => {
  // spotifyApi.setRefreshToken('');
  spotifyApi.setAccessToken('')

  res.send('Logged out')
}

export const postPlaylists = async (req, res) => {
  const selectedPlaylists = req.body

  let allTracks = []

  for (let playlist of selectedPlaylists) {
    const playlistTracks = await retrievePlaylistTracks(playlist)
    allTracks = [...allTracks, ...playlistTracks]
  }
  const analysisData = await retrieveTracksAnalysis(allTracks)

  allTracks.forEach((track, i) => (track.analysis_features = analysisData[i]))

  // console.log(allTracks);

  const sorted = sortTracks(allTracks)
  res.send({ sorted })
}

export const getPlaylists = async (req, res) => {
  try {
    const playlists = await getPlaylistsArr()
    console.log('Sending playlists')
    res.json(playlists)
  } catch (error) {
    console.log(error)
    if (error.body.error.status === 401) {
      res.redirect('/refresh')
    }
  }
}

export const getRedirect = async (req, res) => {
  const tokens = await requestAccessAndRefreshTokens(req.query.code)
  spotifyApi.setAccessToken(tokens.access_token)
  spotifyApi.setRefreshToken(tokens.refresh_token)

  res.redirect('http://localhost:3000/home')
}

export const getRefreshAccessToken = async function (req, res) {
  try {
    const refreshToken = spotifyApi.getRefreshToken()
    console.log('Refresh token:', refreshToken)
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
    })
    const { access_token: accessToken } = response.data
    spotifyApi.setAccessToken(accessToken)
    console.log('Access token refreshed')
    res.redirect('/playlists')
  } catch (error) {
    console.log(error)
    console.log('Refresh failed')
  }
}
