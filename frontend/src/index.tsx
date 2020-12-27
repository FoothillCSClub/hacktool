import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil'
import { grommet, Grommet } from 'grommet'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Dashboard from './Dashboard';
import Authorization from './Authorization';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Projects from './Projects';

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Grommet theme={grommet}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <App />
              </Route>
              <Route exact path="/dashboard">
                <Dashboard />
              </Route>
              <Route exact path="/projects">
                <Projects />
              </Route>
              <Route exact path="/authorization-do-not-share">
                <Authorization />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </BrowserRouter>
        </Grommet>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
