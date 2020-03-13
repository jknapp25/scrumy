import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./views/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="main">
          <Route path="/" exact component={Home} />
        </div>
      </Router>
    </div>
  );
}

export default App;
