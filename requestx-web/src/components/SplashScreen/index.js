import React, { Component } from 'react';
import { connect } from 'react-redux';

import './styles.css';
import { createWallet, fetchUpdatedFunds } from '../../actions/appState';

const mapStateToProps = state => {
  return {
    wallet: state.appState.wallet
  };
};

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCreateWallet = () => {
    this.props.createWallet();

    this.props.fetchUpdatedFunds();

    this.props.history.push({
      pathname: '/home'
    });
  };

  render() {
    console.log(this.props.accountAddress);
    return (
      <div className="splash-screen-grid-container">
        <h1 className="logo-container">Request X</h1>

        <div className="create-wallet-container">
          <button className="primary-btn" onClick={this.handleCreateWallet}>
            Create Wallet
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createWallet: () => dispatch(createWallet()),
  fetchUpdatedFunds: () => dispatch(fetchUpdatedFunds())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
