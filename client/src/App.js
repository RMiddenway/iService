import './App.css';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import PrivateRoute from './auth/PrivateRoute';
import NavBar from './components/NavBar';
import TaskMap from './components/TaskMap';
import BecomeExpert from './pages/BecomeExpert';
import ExpertArea from './pages/ExpertArea';
import FindTask from './pages/FindTask';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import MyTasks from './pages/MyTasks';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TaskForm from './pages/TaskForm';
import store from './store';

function App() {
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
              <PrivateRoute path="/mytasks" component={MyTasks} />
              <PrivateRoute path="/expertarea" component={ExpertArea} />
              <Route exact path="/taskmap" component={TaskMap} />
              <Route path="/findtask" component={FindTask} />
              <PrivateRoute path="/becomeexpert" component={BecomeExpert} />
              <Route path="/howitworks" component={HowItWorks} />
            </Switch>
          </Router>
        </ToastProvider>
      </Provider>
    </div>
  );
}

export default App;
