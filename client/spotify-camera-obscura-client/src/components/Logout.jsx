import * as api from '../api/requests';

function Logout(props) {
    api.getLogout();
    return <div>Logged out</div>;
}

export { Logout };
