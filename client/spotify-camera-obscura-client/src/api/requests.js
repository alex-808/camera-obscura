import axios from 'axios';

const url = 'http://localhost:4000';

const getLogin = () =>
    axios.get(url + '/login').then((res) => console.log(res));

const getPlaylists = async () => {
    const playlists = await axios.get(url + '/playlists');
    return playlists;
};

export { getLogin, getPlaylists };
