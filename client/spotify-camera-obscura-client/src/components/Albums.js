import { useEffect, useState } from 'react';
import * as api from '../api/requests.js';

function Albums() {
    let [state, setState] = useState(0);
    useEffect(() => {
        async function fetchMe() {
            let { data } = await api.getPlaylists();
            // setState(playlists);
            console.log(data[0].name);
        }
        fetchMe();
    });
    return <div>Playlists</div>;
}

export default Albums;
