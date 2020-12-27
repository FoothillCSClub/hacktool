import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil'
import { grommet, Grommet } from 'grommet'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Dashboard from './Dashboard';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Grommet theme={grommet}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
      </Grommet>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
