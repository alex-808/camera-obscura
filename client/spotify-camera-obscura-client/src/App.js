import * as api from './api/requests';

function App() {
    const login = function () {
        api.getLogin();
    };

    const getroot = () => api.getroot();

    return (
        <div className="App">
            <button onClick={login}>Login</button>
            <a href="http://localhost:4000/login">Login</a>
        </div>
    );
}

export default App;
