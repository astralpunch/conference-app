import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import store from './redux';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import history from './history';
import './config';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
