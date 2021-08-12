import { useEffect, useState } from 'react';
import * as api from '../../api/requests.js';
import { Playlist } from './Playlist/Playlist.jsx';
import placeholder from '../../imgs/logo192.png';

function PlaylistPicker({ setTrackData }) {
    const [playlists, setPlaylists] = useState(0);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    useEffect(() => {
        const fetchPlaylists = async () => {
            const { data: playlists } = await api.getPlaylists();
            setPlaylists(playlists);
            console.log(playlists);
        };

        fetchPlaylists();
    }, []);

    const submitSelection = async function () {
        console.log(selectedPlaylists);
        // After submission should I redirect to a new page and pass this with it?
        const { data } = await api.postSelectedPlaylists(selectedPlaylists);
        const { sorted } = data;
        setTrackData(sorted);
        console.log(data);
    };

    const handleClick = function (e) {
        if (e.target.checked) {
            setSelectedPlaylists([...selectedPlaylists, e.target.id]);
        } else {
            setSelectedPlaylists(
                selectedPlaylists.filter((id) => id !== e.target.id)
            );
        }
        console.log(selectedPlaylists);
    };

    const getPlaylistImage = function (playlist) {
        const [image] = playlist.images.filter((el, i) => i === 0);
        return image ? image.url : placeholder;
    };

    if (!playlists) {
        return <div>No state</div>;
    } else {
        return (
            <div>
                <button onClick={submitSelection}>Submit</button>
                State
                {playlists.map((playlist) => (
                    <Playlist
                        playlist={playlist}
                        handleClick={handleClick}
                        key={playlist.id}
                        img={getPlaylistImage(playlist)}
                    />
                ))}
            </div>
        );
    }
}

export { PlaylistPicker };
