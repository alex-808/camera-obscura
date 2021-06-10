import { useEffect } from 'react';
import * as api from './api/requests';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/Login.js';
import Logout from './components/Logout';
import Playlists from './components/Playlists/Playlists';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/playlists">
                        <Playlists />
                    </Route>
                    <Route path="/logout">
                        <Logout />
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
