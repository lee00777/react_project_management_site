import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import Dashboard from './pages/dashboard/Dashboard'
import Project from './pages/project/Project'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Create from './pages/create/Create'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import OnlineUsers from './components/OnlineUsers'
import Chat from './components/Chat'

function App() {
  const { user, authIsReady } = useAuthContext()
  return (
    <div className={!user && authIsReady? 'App bg' : 'App'}>
      { authIsReady && (
        <BrowserRouter>
          { user && <Sidebar /> }
          <div className='container'>
            <Navbar />
            <Switch>
              <Route exact path='/'>
                { !user && <Redirect to="/login" /> }
                { user && <Dashboard /> }
              </Route>
              <Route path='/create'>
                { !user && <Redirect to="/login" /> }
                { user && <Create />}
              </Route>
              <Route path='/projects/:id'>
                { !user && <Redirect to="/login" /> }
                { user && <Project /> }
              </Route>
              <Route path='/login'>
                { !user && <Login /> }
                { user && <Redirect to= "/" />}
              </Route>
              <Route path='/signup'>
                { !user && <Signup /> }
                { user && <Redirect to= "/" />}
              </Route>
            </Switch>
          </div>
          { user && <OnlineUsers /> }
        </BrowserRouter>
      )}
    </div>
  );
}

export default App
