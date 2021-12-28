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

function App() {
  const { user, authIsReady } = useAuthContext()
  return (
    <div className="App">
      { authIsReady && (
        <BrowserRouter>
          <Sidebar />
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
        </BrowserRouter>
      )}
    </div>
  );
}

export default App

/* pages 

- dashboard (homepage)
- login
- signup
- create
- project (project details)

*/