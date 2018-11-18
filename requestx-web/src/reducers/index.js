import { combineReducers } from 'redux';
import { web3Provider } from './web3Provider';
import { appState } from './appState';

export default combineReducers({
  appState,
  web3Provider
});
