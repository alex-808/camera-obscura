import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Logout from './components/Logout';
import PlaylistPicker from './components/Playlists/Playlists';
import Home from './components/Home/Home';
import Explorer from './components/Explorer/Explorer';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route path="/explorer">
                        <Explorer />
                    </Route>
                    <Route path="/">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
