import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Web3Chip from '../common/Web3Chip';
import Blockies from '../common/Blockies';

import { Avatar } from '@material-ui/core';

import './styles.css';
import {
  cashSignedTransaction,
  sendTransaction,
  getBalance,
  createWallet,
  fetchUpdatedFunds
} from '../../actions/appState';
import {
  initilizeWeb3Listeners,
  sendRequest,
  requestAnswered,
  dispatchIncomingRequest,
  dispatchIcomingReply
} from '../../actions/web3Provider';

const mapStateToProps = state => {
  return {
    wallet: state.appState.wallet,
    availableFunds: state.appState.availableFunds,
    incomingRequestObj: state.web3Provider.incomingRequestObj,
    incomingReplyObj: state.web3Provider.incomingReplyObj,
    sendTxComplete: state.appState.sendTxComplete
  };
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIncomingRequestModal: false,
      showIncomingReplyModal: false,
      showRequestFormModal: false,
      requestTo: '',
      requestValue: ''
    };

    this.props.createWallet();

    this.props.fetchUpdatedFunds();
    this.props.initilizeWeb3Listeners();
  }

  static getDerivedStateFromProps(props) {
    let newState = {};

    if (props.wallet) {
      console.log('Wallet Address is: ', props.wallet);
    }
    if (props.incomingRequestObj) {
      newState = {
        ...newState,
        showIncomingRequestModal: true
      };
    }
    if (props.incomingReplyObj) {
      newState = {
        ...newState,
        showIncomingReplyModal: true
      };
    }

    if (props.showIncomingReplyModal) {
      newState = {
        ...newState,
        showIncomingReplyModal: true
      };
    }

    if (props.sendTxComplete) {
      newState = {
        ...newState,
        loading: false,
        showIncomingRequestModal: false
      };
    }
    return newState;
  }

  toggleRequestForm = () => {
    this.setState({
      showRequestFormModal: true
    });
  };

  handleSendRequest = async () => {
    const { requestTo, requestValue } = this.state;

    await this.props.sendRequest(requestTo, Number(requestValue));

    this.setState({
      showRequestFormModal: false
    });
  };

  handleSendIncomingRequest = async () => {
    const walletBalance = getBalance(this.props.wallet.address);

    this.setState({
      loading: true
    });

    const to = this.props.incomingRequestObj.from;
    const value = this.props.incomingRequestObj.value;

    if (Number(this.props.incomingRequestObj.value) > walletBalance)
      await this.props.cashSignedTransaction();

    const transactionHash = await this.props.sendTransaction(to, value);

    this.props.requestAnswered(to, value, transactionHash, true);

    this.props.dispatchIncomingRequest(undefined);
  };

  handleCancelIncomingRequest = () => {
    this.props.dispatchIncomingRequest(undefined);

    this.setState({
      showIncomingRequestModal: false
    });
    this.props.requestAnswered(
      this.props.incomingRequestObj.from,
      this.props.incomingRequestObj.value,
      '',
      false
    );
  };

  handleOnChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { availableFunds, wallet } = this.props;

    if (!wallet) return <div />;

    let incomingRequestObj = this.props.incomingRequestObj
      ? this.props.incomingRequestObj
      : { from: '', value: '' };

    let incomingReplyObj = this.props.incomingReplyObj
      ? this.props.incomingReplyObj
      : {
          from: '',
          txHash: '',
          value: ''
        };

    const walletBalance = getBalance(wallet.address);

    console.log(this.props.incomingReplyObj);

    return (
      <div className="home-grid-container">
        <div className="account-badge">
          <Web3Chip />
        </div>
        <div className="notification">
          <FontAwesomeIcon
            onClick={() => {
              this.setState({ showIncomingRequestModal: true });
            }}
            icon={faBell}
            style={{ color: '#000000', opacity: 0.5, fontSize: 26 }}
          />
        </div>

        <div className="balance">
          <div className="balance-content">
            <p style={{ fontFamily: 'Roboto-light', fontSize: 20, textAlign: 'center' }}>
              Available Funds:
            </p>
            {availableFunds} <span style={{ fontFamily: 'Roboto-light', fontSize: 25 }}>UCASH</span>
          </div>

          <div className="request">
            <button className="primary-btn request-btn" onClick={this.toggleRequestForm}>
              Request
            </button>
          </div>
        </div>

        <div className="balance-wallet-container">
          <div className="balance-wallet">
            <p style={{ fontFamily: 'Roboto-light', fontSize: 20, textAlign: 'center' }}>
              Current Holdings:
            </p>
            {walletBalance} <span style={{ fontFamily: 'Roboto-light', fontSize: 25 }}>UCASH</span>
          </div>

          <div className="deposit">
            <button className="primary-btn deposit-btn" onClick={this.handleDepositFunds}>
              Deposit
            </button>
          </div>
        </div>

        <div
          className="request-form-modal"
          style={{
            display: this.state.showRequestFormModal ? 'block' : 'none'
          }}
        >
          <div className="request-form-modal-content">
            <div className="request-form-container">
              <div className="request-form-title">Send Request</div>

              <div className="request-form-blockies">
                <Avatar style={{ height: 55, width: 55, backgroundColor: 'lightgray' }}>
                  {this.state.requestTo === '' ? null : (
                    <Blockies className="request-blockies-image" seed={this.state.requestTo} />
                  )}
                </Avatar>
              </div>

              <div className="request-form-to">
                <input
                  className="input"
                  value={this.state.requestTo}
                  onChange={this.handleOnChange}
                  name="requestTo"
                  placeholder="Enter Address"
                />
              </div>
              <div className="request-form-value">
                <input
                  className="input"
                  value={this.state.requestValue}
                  onChange={this.handleOnChange}
                  name="requestValue"
                  placeholder="Enter Amount"
                />
              </div>

              <div className="request-form-actions">
                <div
                  className="request-cancel"
                  onClick={() => {
                    this.setState({ showRequestFormModal: false });
                  }}
                >
                  CANCEL
                </div>
                <div className="request-request" onClick={this.handleSendRequest}>
                  REQUEST
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="request-receive-modal"
          style={{
            display: this.state.showIncomingRequestModal ? 'block' : 'none'
          }}
        >
          <div className="request-receive-modal-content">
            <div className="request-container">
              <div className="request-label">
                <p style={{ fontFamily: 'Roboto-Light', fontSize: 14, lineHeight: 0.8 }}>
                  Incoming Request...
                </p>
              </div>
              <div className="request-blockies">
                <Avatar style={{ height: 55, width: 55 }}>
                  <Blockies className="request-blockies-image" seed={incomingRequestObj.from} />
                </Avatar>
              </div>

              {incomingRequestObj ? (
                <div className="request-content">
                  <p style={{ lineHeight: 0.5 }}>
                    <span style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>
                      {`${incomingRequestObj.from.slice(0, 4)}...${incomingRequestObj.from.substr(
                        incomingRequestObj.from.length - 5
                      )}`}{' '}
                      is requesting
                    </span>
                  </p>

                  <p style={{ lineHeight: 0.5 }}>
                    <span style={{ fontFamily: 'Roboto-Regular', fontSize: 24 }}>
                      {incomingRequestObj.value}{' '}
                      <span style={{ fontFamily: 'Roboto-Regular', fontSize: 18, opacity: 0.7 }}>
                        UCASH
                      </span>
                    </span>
                  </p>
                </div>
              ) : null}
              <div className="request-actions">
                <div className="request-accept" onClick={this.handleSendIncomingRequest}>
                  SEND
                </div>
                <div className="request-reject" onClick={this.handleCancelIncomingRequest}>
                  CANCEL
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="request-accepted-modal"
          style={{
            display: this.state.showIncomingReplyModal ? 'block' : 'none'
          }}
        >
          <div className="request-accepted-modal-content">
            <div className="request-accepted-container">
              <div className="request-label">
                <p style={{ fontFamily: 'Roboto-Light', fontSize: 14, lineHeight: 0.8 }}>
                  Incoming Notification...
                </p>
              </div>
              <div className="request-blockies">
                <Avatar style={{ height: 55, width: 55 }}>
                  <Blockies className="request-blockies-image" seed={incomingReplyObj.from} />
                </Avatar>
              </div>

              {incomingReplyObj ? (
                <div className="request-content">
                  <p style={{ lineHeight: 0.5 }}>
                    <span style={{ fontFamily: 'Roboto-Regular', fontSize: 16 }}>
                      {`${incomingReplyObj.from.slice(0, 4)}...${incomingReplyObj.from.substr(
                        incomingReplyObj.from.length - 5
                      )}`}{' '}
                      <br />
                      <br />
                      <br />
                      {!incomingReplyObj.status ? 'declined your request of' : 'has sent you '}
                    </span>
                  </p>

                  <p style={{ lineHeight: 0.5 }}>
                    <span style={{ fontFamily: 'Roboto-Regular', fontSize: 24 }}>
                      {incomingReplyObj.value}{' '}
                      <span style={{ fontFamily: 'Roboto-Regular', fontSize: 18, opacity: 0.7 }}>
                        UCASH
                      </span>
                    </span>
                  </p>
                </div>
              ) : null}

              <div className="request-accepted-actions">
                <div
                  className="request-okay"
                  onClick={() => {
                    this.props.dispatchIcomingReply(undefined);
                    this.setState({ showIncomingReplyModal: false });
                  }}
                >
                  OKAY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  cashSignedTransaction: () => dispatch(cashSignedTransaction()),
  sendTransaction: (to, value) => dispatch(sendTransaction(to, value)),
  initilizeWeb3Listeners: () => dispatch(initilizeWeb3Listeners()),
  sendRequest: (to, amount) => dispatch(sendRequest(to, amount)),
  requestAnswered: (to, amount, txHash, status) =>
    dispatch(requestAnswered(to, amount, txHash, status)),
  createWallet: () => dispatch(createWallet()),
  fetchUpdatedFunds: () => dispatch(fetchUpdatedFunds()),
  dispatchIncomingRequest: obj => dispatch(dispatchIncomingRequest(obj)),
  dispatchIcomingReply: obj => dispatch(dispatchIcomingReply(obj))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
