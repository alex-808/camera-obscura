import { PlaylistPicker } from '../PlaylistPicker/PlaylistPicker.jsx';
import { Explorer } from '../Explorer/Explorer.jsx';
import { useState } from 'react';
import { testTracks, testTracks2 } from '../../testData/testData';

const Home = function (props) {
  //const [trackData, setTrackData] = useState(0);
  const [trackData, setTrackData] = useState(testTracks2.sorted);

  if (!trackData) {
    return <PlaylistPicker setTrackData={setTrackData} />;
  } else {
    return <Explorer trackData={trackData} />;
  }
};

export { Home };
