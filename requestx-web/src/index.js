import React from 'react';
import ReactDOM from 'react-dom';

// Import Redux Objects
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Import Components
import App from './components/App';

import './index.css';

const middleware = applyMiddleware(thunk);
export const storeObj = createStore(reducer, {}, middleware);

const Application = () => (
  <Provider store={storeObj}>
    <App />
  </Provider>
);

ReactDOM.render(<Application />, document.getElementById('root'));
