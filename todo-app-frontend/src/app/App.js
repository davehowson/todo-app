import React, { Component } from 'react';
import { 
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import { Layout, notification } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import Dashboard from '../task/Dashboard';
import AppHeader from '../common/AppHeader';
import Login from '../user/Login';
import Signup from '../user/Signup';
import Profile from '../user/Profile';
import PrivateRoute from '../util/PrivateRoute'

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../util/Constants';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);   

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });   
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
      this.props.history.push("/");
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo="/login", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
  }

  handleLogin() {
    this.loadCurrentUser();
    this.props.history.push("/");
    console.log("Authenticated");
  }

  render() {
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} 
                onLogout={this.handleLogout} />
        <Content className="app-content">
          <Switch>
            <Route path="/login" 
              render={(props) => <Login onLoad={this.loadCurrentUser} onLogin={this.handleLogin} {...props} />}></Route>
            <Route path="/signup" component={Signup}></Route>
            <PrivateRoute authenticated={this.state.isAuthenticated} exact path="/" component={Dashboard} ></PrivateRoute>
            <PrivateRoute authenticated={this.state.isAuthenticated} path="/users/:username" component={Profile} ></PrivateRoute>
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
