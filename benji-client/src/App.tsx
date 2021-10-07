import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={() => <Dashboard />} />
        <Route path="/login" render={() => <Login />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
