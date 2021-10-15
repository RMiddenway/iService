import './App.css';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import PrivateRoute from './auth/PrivateRoute';
import NavBar from './components/NavBar';
import TaskMap from './components/TaskMap';
import FindTask from './pages/FindTask';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TaskForm from './pages/TaskForm';
import store from './store';

function App() {
  // const isSignedIn = () => localStorage.getItem("IS_SIGNED_IN") === "true";

  return (
    <div className="App">
      <Provider store={store}>
        <ToastProvider>
          <Router>
            <NavBar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/signin" component={SignIn} />
              <PrivateRoute path="/posttask" component={TaskForm} />
              <Route exact path="/taskmap" component={TaskMap} />
              <Route path="/findtask" component={FindTask} />
            </Switch>
          </Router>
        </ToastProvider>
      </Provider>
    </div>
  );
}

export default App;
