import PlaylistPicker from '../PlaylistPicker/Playlists';
import Explorer from '../Explorer/Explorer';
import { useState } from 'react';
import { testTracks } from '../../testData/testData';

const Home = function (props) {
    const [trackData, setTrackData] = useState(0);
    // const [trackData, setTrackData] = useState(testTracks.sorted);

    if (!trackData) {
        return <PlaylistPicker setTrackData={setTrackData} />;
    } else {
        return <Explorer trackData={trackData} />;
    }
};

export default Home;
