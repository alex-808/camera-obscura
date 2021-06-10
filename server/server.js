import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
    login,
    logout,
    postPlaylists,
    getPlaylists,
    getRedirect,
} from './controllers/controllers.js';

const app = express();

app.use(cors());
app.use(bodyParser());

app.get('/login', login);

app.get('/redirect', getRedirect);

app.get('/playlists', getPlaylists);

app.post('/playlists', postPlaylists);

app.get('/logout', logout);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
