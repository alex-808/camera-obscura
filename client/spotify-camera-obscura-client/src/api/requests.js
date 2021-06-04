import axios from 'axios';

const url = 'http://localhost:4000';

const getLogin = () =>
    axios.get(url + '/login').then((res) => console.log(res));

const getroot = () => axios.get(url).then((res) => console.log(res));

export { getLogin, getroot };
