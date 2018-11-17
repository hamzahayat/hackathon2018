import React, { Component } from 'react';
import './App.css';

let web3;

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.onload = () => {
      web3 = window.aionweb3
    }
  }

  handleSignTransaction = async () => {
    const tx = {
      to: '0xa020f60b3f4aba97b0027ca81c5d20c9898d7c43a50359d209596b86e8ce3ca2',
      value: 0,
      data: "",
      from: web3.eth.accounts[0]
    };

    const signedTx = await web3.eth.signTransaction(tx)
    console.log(signedTx);
  }

  handleCancelChecks = async () => {
    const tx = {
      to: '0xa020f60b3f4aba97b0027ca81c5d20c9898d7c43a50359d209596b86e8ce3ca2',
      value: 0,
      data: "",
      from: web3.eth.accounts[0]
    };

    const txHash = await web3.eth.sendTransaction(tx);
    console.log(txHash);
  }


  render() {
    return (
      <div>
        <button
          className="button is-primary"
          onClick={this.handleSignTransaction}
        >
          Sign transactions
            </button>
        <button
          className="button is-primary"
          onClick={this.handleCancelChecks}
        >
          cancel checks
</button>
      </div>
    );
  }
}

export default App;
