import PlaylistPicker from '../Playlists/Playlists';
import Explorer from '../Explorer/Explorer';
import { useState } from 'react';

const Home = function (props) {
    const [trackData, setTrackData] = useState(0);

    if (!trackData) {
        return <PlaylistPicker setTrackData={setTrackData} />;
    } else {
        return <Explorer />;
    }
};

export default Home;
