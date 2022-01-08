import Home from '../src/components/Home/home';
import Game from '../src/components/Game/game';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

function App() {
  return (
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/game" exact>
            <Game />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
