import "./App.css";

import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

import NavBar from "./components/NavBar";
import FindTask from "./pages/FindTask";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import TaskForm from "./pages/TaskForm";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  const isSignedIn = () => localStorage.getItem("IS_SIGNED_IN") === "true";

  return (
    <div className="App">
      <ToastProvider>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <PrivateRoute path="/posttask" component={TaskForm} />
            <Route path="/findtask" component={FindTask} />
          </Switch>
        </Router>
      </ToastProvider>
    </div>
  );
}

export default App;
