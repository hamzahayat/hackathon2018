import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { withStyles } from '@material-ui/core/styles';
import { Avatar, Chip, Paper, Typography, Grid } from '@material-ui/core';
// import FaceIcon from '@material-ui/icons/Face';
import Blockies from '../Blockies';

import '../styles.css';
import './styles.css';

const styles = theme => ({
  root: {
    display: 'flex',
    width: 230,
    height: 48,
    borderRadius: 25,
    margin: theme.spacing.unit
  },
  chip: {
    margin: theme.spacing.unit,
    color: 'black',
    backgroundColor: 'transparent',
    fontSize: 8
  },
  badge: {
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
    marginRight: 2,
    width: 7,
    height: 7,
    backgroundColor: 'green'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  typography: {
    textAlign: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 11
  }
});

const mapStateToProps = state => {
  return {
    wallet: state.appState.wallet,
    currentProviderName: state.web3Provider.currentProviderName
  };
};

class Web3Chip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipText: 'Copy Address to Clipboard'
    };
  }

  render() {
    const { classes, currentProviderName, wallet } = this.props;

    // const wallet = {
    //   address: '0xa09a2911ffcdc8724cfe13369534e3f33c07422d7c762b2dad0b1b3ba878ab04'
    // };

    const formatedAddress = wallet
      ? `${wallet.address.slice(0, 6)}...${wallet.address.substr(wallet.address.length - 4)}`
      : '';

    return (
      <div className="pointer-cursor">
        <CopyToClipboard text={wallet.address ? wallet.address : ''}>
          <Paper elevation={4} square={false} className={classes.root}>
            <Chip
              avatar={
                wallet.address ? (
                  <Avatar>
                    <Blockies seed={wallet.address} />
                  </Avatar>
                ) : null
              }
              label={
                wallet.address ? (
                  <div className="pointer-cursor">
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item>
                        <Typography style={{ fontSize: 12 }}>{formatedAddress}</Typography>
                      </Grid>
                      <Grid item>
                        <Avatar className={classes.badge} />
                      </Grid>
                      <Grid item>
                        <Typography
                          align={'center'}
                          gutterBottom
                          variant="caption"
                          className={classes.typography}
                        >
                          {currentProviderName}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <Typography
                    align={'center'}
                    gutterBottom
                    variant="subheading"
                    className={classes.typography}
                  >
                    Loading...
                  </Typography>
                )
              }
              color="secondary"
              className={classes.chip}
            />
          </Paper>
        </CopyToClipboard>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Web3Chip));
