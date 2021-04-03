import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import AuthRoute from './util/AuthRoute';
import axios from 'axios';

import jwtDecode from 'jwt-decode';

//* redux components
import store from './redux/store';
import {Provider} from 'react-redux';
import {SET_AUTHENTICATED} from './redux/types'
import {logOutUser, getUserData} from './redux/actions/userActions';
//* Only Components imports
import NavBar from './components/NavBar'

//* Only Page imports
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import User from './pages/User';
//TODO: Change the color with hanin
const theme = createMuiTheme({
  palette:{
    primary:{
      main: '#84ffff'
    },
    secondary:{
      main:'#fafafa'
    }
  }
})

axios.defaults.baseURL = 'https://europe-west1-socialclone-6e722.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if(token){
 const decodedToken = jwtDecode(token);
 if(decodedToken.exp*1000 < Date.now()){
   store.dispatch(logOutUser());
   window.location.href = '/login';
 }else {
   store.dispatch({ type: SET_AUTHENTICATED});
   axios.defaults.headers.common['authorization'] = token;
   store.dispatch(getUserData());
 }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
          <Router>
            <NavBar />
              <div className="container">
                <Switch>
                  <Route exact path ='/' component={Home} />
                  <AuthRoute exact path ='/login' component={Login} />
                  <AuthRoute exact path ='/signup' component={Signup} />
                  <Route exact path="/user/:handle" component={User} />
                  <Route exact path="/user/:handle/scream/:screamId" component={User}/>
                </Switch>
              </div>
          </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
