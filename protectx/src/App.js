import React, { Component } from "react";
import "./App.css";
import logo from "./images/ProtectX.png";
import axios from "axios";
let web3;

window.onload = () => {
  web3 = window.aionweb3;

  console.log("came here", web3);
};

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
    console.log(window.aionweb3);
    const tx = {
      to: this.state.senderAddress,
      value: 0,
      data: "",
      from: web3.eth.accounts[0],
      number: 10
    };

    const signedTx = await web3.eth.signTransaction(tx);
    console.log(JSON.stringify(signedTx));

    var address= '';
   // var data='{messageHash: "0x093cf778e49334fe595f19838c181c4c78568fc6e21c6f07a372612bf6dfc740", signature: "0xa75d1c6e59833fad80ba02cc8010c4a99787a0859941613a…765055f57e8e0fb2a66a38adac762745d019d44fc71da4d0c", rawTransaction: "0xf89b07a0a020f60b3f4aba97b0027ca81c5d20c9898d7c43…765055f57e8e0fb2a66a38adac762745d019d44fc71da4d0c"}';
    var data = JSON.stringify(signedTx);
    const body =  {
      address: address,
      data: data
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    axios.post('http://localhost:3005/create',body,config)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });


  
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
          <img src={logo} className="logo-images" alt="logo" />
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
