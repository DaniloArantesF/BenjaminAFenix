import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/';
import Offline from './pages/Offline/';

const App:React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={() => <Dashboard />} />
        <Route path="/login" render={() => <Login />} />
        <Route path="/offline" render={() => <Offline />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
