import { useEffect } from 'react';

function Playlist({ playlist }, setState, state) {
    useEffect(() => {
        console.log('Rendering Playlist');
    });

    const handleClick = function (e) {
        console.log(e.target.checked);
        // ! Need to get a persistent list of selected playlists
        // The problem is that each of these is a playlist which was being given it's own selectedPlaylists array. Really this needs to be passed back up to Playlists
        if (e.target.checked) {
            setState({
                selectedPlaylists: [state.selectedPlaylists, e.target.id],
            });
        }
        // else {
        //     selectedPlaylists.filter((id) => {
        //         console.log(id);
        //         return id !== e.target.id;
        //     });
        // }
    };
    return <div>{playlist.name}</div>;
}

export default Playlist;
