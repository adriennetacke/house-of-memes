import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import * as Realm from "realm-web";
import { useRealmApp, RealmAppProvider } from "./RealmApp";
import GamePage from './GamePage';
import HostPage from './HostPage';

export const APP_ID = 'house_of_memes-zajem';

const RequireLoggedInUser = ({ children }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const app = useRealmApp();

  useEffect(() => {
    async function login() {
      setIsLoggingIn(true);

      try {
        await app.logIn(Realm.Credentials.anonymous());
        console.log('Logged in!');
      } catch (e) {
        setIsLoggingIn(false);
      }
    }

    if (!app.currentUser && !isLoggingIn) {
      login();
    }
  }, [app, isLoggingIn]);

  if (!app.currentUser) {
    return <div>Loading...</div>
  } else {
    return children;
  }
};

function App() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <Router basename={process.env.REACT_APP_PUBLIC_URL}>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/game">
              <Redirect to="/" />
            </Route>
            <Route exact path="/game/:gameId">
              <GamePage />
            </Route>
            <Route exact path="/game/:gameId/host">
              <HostPage />
            </Route>
          </Switch>
        </Router>
      </RequireLoggedInUser>
    </RealmAppProvider>
  );
}

export default App;
