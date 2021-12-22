import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Login } from './Login'
import { Logout } from './Logout'
import { Home } from './Home/Home'

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
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export { App }
