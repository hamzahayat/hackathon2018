// Import Factory Contract ABI
import Web3 from 'aion-web3';

// Import Contract Address and ABI
import {
  NOTIFICATION_CONTRACT_ABI,
  NOTIFICATION_CONTRACT_ADDRESS
} from '../blockchainServices/abi/notificationContract';

// Declare Constants
export const INCOMING_REQUEST = 'INCOMING_REQUEST';
export const INCOMING_REPLY = 'INCOMING_REPLY';

const provider = new Web3.providers.HttpProvider('https://aion-mastery.jonpurdy.com');
const web3 = new Web3(provider);

const notificationContract = web3.eth
  .contract(NOTIFICATION_CONTRACT_ABI)
  .at(NOTIFICATION_CONTRACT_ADDRESS);

export function dispatchIncomingRequest(data) {
  return {
    type: INCOMING_REQUEST,
    payload: data
  };
}

export function dispatchIcomingReply(data) {
  return {
    type: INCOMING_REPLY,
    payload: data
  };
}

export function sendRequest(to, amount) {
  return async (dispatch, getState) => {
    // Declare Variables
    const { wallet } = getState().appState;

    // Declare Account and get Nonce
    // const account = new Wallet(privateKey);
    const nonce = web3.eth.getTransactionCount(wallet.address);

    // Get Contract Data
    const gasPrice = web3.eth.gasPrice;
    const gas = await notificationContract.sendRequest.estimateGas(wallet.address, to, amount, {
      from: wallet.address
    });

    console.log('nonce', nonce);
    console.log('gasprice', gasPrice.toString());
    console.log('gas', gas.toString());

    const methodData = notificationContract.sendRequest.getData(wallet.address, to, amount);

    // Declare Transaction
    const transaction = {
      to: NOTIFICATION_CONTRACT_ADDRESS,
      nonce,
      gasPrice,
      gas,
      data: methodData,
      timestamp: Date.now() * 1000
    };

    // Sign Transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    console.log(signedTransaction);

    // Send Transaction
    const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);

    console.log(transactionHash);
  };
}

export function requestAnswered(to, amount, txHash, status) {
  return async (dispatch, getState) => {
    // Declare Variables
    const { wallet } = getState().appState;

    // Declare Account and get Nonce
    // const account = new Wallet(privateKey);
    const nonce = web3.eth.getTransactionCount(wallet.address);

    // Get Contract Data
    const gasPrice = web3.eth.gasPrice;
    const gas = await notificationContract.requestAnswered.estimateGas(
      wallet.address,
      to,
      txHash,
      status,
      amount,
      {
        from: wallet.address
      }
    );

    console.log('nonce', nonce);
    console.log('gasprice', gasPrice.toString());
    console.log('gas', gas.toString());

    const methodData = notificationContract.requestAnswered.getData(
      wallet.address,
      to,
      txHash,
      status,
      amount
    );

    // Declare Transaction
    const transaction = {
      to: NOTIFICATION_CONTRACT_ADDRESS,
      nonce,
      gasPrice,
      gas,
      data: methodData,
      timestamp: Date.now() * 1000
    };

    // Sign Transaction
    const signedTransaction = await wallet.signTransaction(transaction);

    console.log(signedTransaction);

    // Send Transaction
    const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);

    console.log(transactionHash);
  };
}

export function initilizeWeb3Listeners() {
  return async (dispatch, getState) => {
    // Declare Variables
    const { address } = getState().appState.wallet;

    // Declare Incoming Request Event Listener
    const incomingRequestEvent = notificationContract.IncomingRequest(
      {},
      { fromBlock: web3.eth.blockNumber, toBlock: 'latest' }
    );

    incomingRequestEvent.watch((error, result) => {
      console.log('Incoming request...');
      console.log(result);
      // Extract Variables from Result
      const { reqFrom, reqTo } = result.args;
      const amountBN = result.args.reqValue;
      const amount = Number(amountBN.toString());

      // Declare Object
      const requestObj = {
        from: reqFrom,
        to: reqTo,
        value: amount
      };

      // If Request To matches current address, dispatch Event
      if (reqTo === address) {
        dispatch(dispatchIncomingRequest(requestObj));
      }

      console.log(error);
    });

    console.log('listening to 2nd event');

    // Declare Request Answered Event Listener
    const requestAnsweredEvent = notificationContract.RequestAnswered(
      {},
      { fromBlock: web3.eth.blockNumber, toBlock: 'latest' }
    );

    requestAnsweredEvent.watch((error, result) => {
      const { reqFrom, reqTo, txHash, status } = result.args;
      const amountBN = result.args.reqValue;
      const amount = Number(amountBN.toString());

      console.log('Incoming Notification...');
      console.log(result);
      const replyObject = {
        from: reqFrom,
        to: reqTo,
        value: amount,
        txHash: txHash,
        status
      };

      console.log(reqTo);
      console.log(address);

      if (reqTo === address) {
        dispatch(dispatchIcomingReply(replyObject));
      }

      console.log('error', error);
    });
  };
}
