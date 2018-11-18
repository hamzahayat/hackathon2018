// Import libraries
import Web3 from 'aion-web3';
import axios from 'axios';
import Accounts from 'aion-keystore';
// import { dispatchIncomingRequest, requestAnswered } from './web3Provider';
// import { ethers } from 'ethers';

const provider = new Web3.providers.HttpProvider('https://aion-mastery.jonpurdy.com');
const web3 = new Web3(provider);

export const SIGNED_TX_CAHSED = 'SIGNED_TX_CAHSED';
export const SIGNED_TX_FETCHED = 'SIGNED_TX_FETCHED';
export const WALLET_CREATED = 'WALLET_CREATED';
export const SEND_TX_COMPLETE = 'SEND_TX_COMPLETE';
export const UPDATE_FUNDS = 'UPDATE_FUNDS';

export function dispatchSendTransactionComplete(data) {
  return {
    type: SEND_TX_COMPLETE,
    payload: data
  };
}
export function dispatchSignedTransactionCashed(data) {
  return {
    type: SIGNED_TX_CAHSED,
    payload: data
  };
}

export function dispatchSignedTransactionFetched(data) {
  return {
    type: SIGNED_TX_FETCHED,
    payload: data
  };
}
export function dispatchWalletCreated(data) {
  return {
    type: WALLET_CREATED,
    payload: data
  };
}
export function dispatchUpdatedFunds(data) {
  return {
    type: UPDATE_FUNDS,
    payload: data
  };
}

export function createWallet() {
  return dispatch => {
    const wallet = createWalletService();
    dispatch(dispatchWalletCreated(wallet));
  };
}

const createWalletService = () => {
  const accounts = new Accounts();
  // const wallet = accounts.create(ethers.utils.randomBytes(32));
  const wallet = accounts.privateKeyToAccount(
    'e6dd33c722f1b3bb9b295bc3e4fbb1d19e0bae16c4be4cc17bbb6ce6aa91dc8ead10ca20167c21982917a6936727313e183326d98dbc802d846f889874ac687c'
  );
  // const wallet = accounts.privateKeyToAccount(
  //   '0x53b9c970b328b61d5cdd91cbe64886432d27f0b0c0c99f88fd2b7d08a19d45551bc535eca78c8fce16a0b323ff367ca8e7018c55c42a4de6e49d693160961acc'
  // );
  return wallet;
};

export function fetchSignedTransactions() {
  return async (dispatch, getState) => {
    const { hardwareWalletAddress } = getState().appState;

    try {
      const response = await axios.get('http://localhost:8000/', {
        address: hardwareWalletAddress
      });

      if (response.status !== 200) {
        throw Error(response.statusText);
      }

      const signedTransaction = response.data.signedTransaction;
      dispatch(dispatchSignedTransactionFetched(signedTransaction));
    } catch (error) {
      console.log(error);
    }
  };
}

export function fetchUpdatedFunds() {
  return async (dispatch, getState) => {
    const { signedTransactions } = getState().appState;

    const availableFunds = signedTransactions.length * 5;

    dispatch(dispatchUpdatedFunds(availableFunds));
  };
}

export function cashSignedTransaction() {
  return async (dispatch, getState) => {
    // Declare variables
    const { signedTransactions } = getState().appState;

    // Get Latest  Signed Transaction
    const signedTransaction = signedTransactions.shift();

    // Send Raw transactions
    const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);

    // Get Transaction Receipt
    const transactionReceipt = getTransactionReceipt(transactionHash);

    // Dispatch Receipet
    if (transactionReceipt !== undefined) {
      dispatch(dispatchSignedTransactionFetched(signedTransactions));
      dispatch(dispatchSignedTransactionCashed(transactionReceipt));
    }
  };
}

export function sendTransaction(to, value) {
  return async (dispatch, getState) => {
    // Declare Variables
    const { wallet } = getState().appState;

    const nonce = web3.eth.getTransactionCount(wallet.address);
    const gasPrice = web3.eth.gasPrice;

    const valueBN = value * 1e18;

    const gas = web3.eth.estimateGas(
      { to, value: valueBN, timestamp: Date.now() * 1000 },
      { from: wallet.address }
    );

    // Declare Transaction
    const transaction = {
      to,
      value: valueBN,
      nonce,
      gasPrice,
      gas,
      timestamp: Date.now() * 1000
    };

    // Sign Transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send Transaction
    const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);
    const transactionReceipt = getTransactionReceipt(transactionHash);

    dispatch(dispatchSendTransactionComplete(transactionReceipt ? true : false));

    return transactionHash;
  };
}

const getTransactionReceipt = transactionHash => {
  let transactionReceipt = null;

  do {
    transactionReceipt = web3.eth.getTransactionReceipt(transactionHash);
  } while (transactionReceipt == null);

  console.log('Transaction Complete!');

  console.log(transactionReceipt);

  return transactionReceipt;
};

export const getBalance = address => {
  const balance = web3.eth
    .getBalance(address)
    .shiftedBy(-18)
    .toFixed(0)
    .toString();

  return balance;
};
