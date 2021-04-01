import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import Subject from "./components/subjectComponent";
import Discuss from "./components/discussComponent";
import Header from "./components/headerComponent";
import Landing from "./components/landingComponent";
import Upload from "./components/uploadComponent";


function App() {

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/subject" component={Subject} />
          <Route path="/discuss" component={Discuss} />
          <Route path="/upload" component={Upload} />

        </Switch>
      </div>
    </Router>
  );
}



export default App;
