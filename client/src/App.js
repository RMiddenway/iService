import "./App.css";

import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

import NavBar from "./components/NavBar";
import FindTask from "./pages/FindTask";
import Home from "./pages/Home";
import TaskForm from "./pages/TaskForm";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/posttask" component={TaskForm} />
            <Route path="/findtask" component={FindTask} />
          </Switch>
        </Router>
      </ToastProvider>
    </div>
  );
}

export default App;
