import PlaylistPicker from '../PlaylistPicker/Playlists';
import Explorer from '../Explorer/Explorer';
import { useState } from 'react';

const Home = function (props) {
    const [trackData, setTrackData] = useState(0);

    if (!trackData) {
        return <PlaylistPicker setTrackData={setTrackData} />;
    } else {
        return <Explorer trackData={trackData} />;
    }
};

export default Home;
