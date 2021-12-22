import axios from 'axios'

const url = 'http://localhost:4000'

const getPlaylists = async () => {
  const playlists = await axios.get(url + '/playlists')
  return playlists
}

const postSelectedPlaylists = playlists =>
  axios.post(url + '/playlists', playlists)

const getLogout = () => axios.get(url + '/logout')

export { getPlaylists, postSelectedPlaylists, getLogout }
