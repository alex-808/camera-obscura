import { useEffect, useState } from 'react';
import * as api from '../../api/requests.js';
import Playlist from './Playlist/Playlist.js';

function Playlists() {
    let [state, setState] = useState(0);
    useEffect(() => {
        const fetchPlaylists = async () => {
            const { data: playlists } = await api.getPlaylists();
            setState({ playlists: playlists });
        };
        fetchPlaylists();
    }, []);

    if (!state) {
        return <div>No state</div>;
    } else {
        return (
            <div>
                {state.playlists.map((playlist) => (
                    <Playlist key={playlist.id} playlist={playlist} />
                ))}
                State
            </div>
        );
    }
}

export default Playlists;
