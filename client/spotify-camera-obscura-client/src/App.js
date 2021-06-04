import { useEffect } from 'react';
import * as api from './api/requests';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './components/Login.js';
import Albums from './components/Albums.js';

function App() {
    const login = function () {
        api.getLogin();
    };

    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/albums">
                        <Albums />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
