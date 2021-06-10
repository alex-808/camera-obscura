import { useEffect, useState } from 'react';
import * as api from '../../api/requests.js';
import Playlist from './Playlist/Playlist.js';

function Playlists() {
    const [playlists, setPlaylists] = useState(0);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    useEffect(() => {
        const fetchPlaylists = async () => {
            const { data: playlists } = await api.getPlaylists();
            setPlaylists(playlists);
            console.log(playlists);
            console.log(selectedPlaylists);
        };

        fetchPlaylists();
    }, []);

    const submitSelection = function () {
        console.log(selectedPlaylists);
        api.postSelectedPlaylists(selectedPlaylists);
    };

    const handleClick = function (e) {
        if (e.target.checked) {
            setSelectedPlaylists([...selectedPlaylists, e.target.id]);
        } else {
            setSelectedPlaylists(
                selectedPlaylists.filter((id) => id !== e.target.id)
            );
        }
    };

    if (!playlists) {
        return <div>No state</div>;
    } else {
        return (
            <div>
                <button onClick={submitSelection}>Submit</button>
                State
                {playlists.map((playlist) => (
                    <>
                        <Playlist playlist={playlist} />
                        <input
                            type="checkbox"
                            key={playlist.id}
                            id={playlist.id}
                            onChange={handleClick}
                        />
                    </>
                ))}
            </div>
        );
    }
}

export default Playlists;
