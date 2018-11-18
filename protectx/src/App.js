import React, { Component } from "react";
import "./App.css";
import logo from "./images/ProtectX.png";
let web3;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderAddress: "",
      apiKey: ""
    };
    this.change = this.change.bind(this);
  }

  componentWillMount() {
    window.addEventListener("load", () => {
      web3 = global.aionweb3;
    });
  }

  change(e) {
    const value = e.target.value;
    const input = e.target.name;
    this.setState({
      [input]: value
    });
    e.preventDefault();
  }
  handleSignTransaction = async () => {
    const tx = {
      to: this.state.senderAddress,
      value: 0,
      data: "",
      from: web3.eth.accounts[0],
      number: 10
    };

    const signedTx = await web3.eth.signTransaction(tx);
    console.log(JSON.stringify(signedTx));
  };

  handleCancelChecks = async () => {
    const tx = {
      to: this.state.senderAddress,
      value: 0,
      data: "",
      from: web3.eth.accounts[0]
    };

    const txHash = await web3.eth.sendTransaction(tx);
    console.log(txHash);
  };

  render() {
    const { senderAddress, apiKey } = this.state;
    return (
      <div className="home">
        <div className="logo">
          <img src={logo} className="logo" alt="logo" />
        </div>
        <div className="labelTo">
          <label>To(Address)</label>
        </div>
        <div className="txtTo">
          <input
            type="text"
            onChange={this.change}
            name="senderAddress"
            value={senderAddress}
          />
        </div>
        <div className="labelApi">
          <label>Api</label>
        </div>
        <div className="txtApi">
          <input
            type="text"
            onChange={this.change}
            name="apiKey"
            value={apiKey}
          />
        </div>

        <div className="sign">
          <button
            className="button is-primary"
            onClick={this.handleSignTransaction}
          >
            {" "}
            Sign transactions
          </button>
        </div>
        <div className="cancel">
          <button
            className="button is-primary"
            onClick={this.handleCancelChecks}
          >
            cancel checks
          </button>
        </div>
      </div>
    );
  }
}

export default App;
