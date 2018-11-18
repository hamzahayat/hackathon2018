import {
  SIGNED_TX_CAHSED,
  SIGNED_TX_FETCHED,
  WALLET_CREATED,
  SEND_TX_COMPLETE,
  UPDATE_FUNDS
} from '../actions/appState';

const initialState = {
  signedTransactions: [
    {
      messageHash: '0x1c8025e18901169b23a8db0781c1744256e47910a65a7254833c542b597f2291',
      signature:
        '0x3e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8ded380c561c7e0e8bf18302591b9dfb3c279e0e025a8810ea76b7f984d77b9b67dd3fa050d14503f36bc820331e5e60a7764a191bbc9c0191f3ce735c53a6fc0a',
      rawTransaction:
        '0xf8a481e2a0a06eb1780f9e8c0c3a86158f55c315b60966d64a3020bcbe0e3572ee67e2ca51884563918244f400008087057af012cf9ce88252088800000002540be40001b8603e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8ded380c561c7e0e8bf18302591b9dfb3c279e0e025a8810ea76b7f984d77b9b67dd3fa050d14503f36bc820331e5e60a7764a191bbc9c0191f3ce735c53a6fc0a'
    },
    {
      messageHash: '0x918d4bf4449a1ea6d86c7f0eed10bdedd08ff69dcc2ac8823fdad953dc5f2c29',
      signature:
        '0x3e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8d4b442a5ddc430837d7cad4af4b6d17e420e60596eafdf92fa6054e23f26ee70b84014bc8797172fc448d50033d9fe5b442467ebe298657641373e7e60654e508',
      rawTransaction:
        '0xf8a481e3a0a06eb1780f9e8c0c3a86158f55c315b60966d64a3020bcbe0e3572ee67e2ca51884563918244f400008087057af012cfdb688252088800000002540be40001b8603e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8d4b442a5ddc430837d7cad4af4b6d17e420e60596eafdf92fa6054e23f26ee70b84014bc8797172fc448d50033d9fe5b442467ebe298657641373e7e60654e508'
    },
    {
      messageHash: '0xc717db94464b189c3d7e5cd34d59f6aebf297ea1bb2b08247b858dfe43c9b70e',
      signature:
        '0x3e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8dd2c74249e1312e67da9a85de8be9cbb2f26e395e5b3ec49359ca34be6839c160449ce1125b411f4243e5e18151c780aff62839f41f007a3516f908758a63ca03',
      rawTransaction:
        '0xf8a481e4a0a06eb1780f9e8c0c3a86158f55c315b60966d64a3020bcbe0e3572ee67e2ca51884563918244f400008087057af012d00e308252088800000002540be40001b8603e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8dd2c74249e1312e67da9a85de8be9cbb2f26e395e5b3ec49359ca34be6839c160449ce1125b411f4243e5e18151c780aff62839f41f007a3516f908758a63ca03'
    },
    {
      messageHash: '0xff6e8aa7575fb5c69ec55a1621d5ed6b0cb051ab66f078de44212666def5bc12',
      signature:
        '0x3e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8da5eaa094f819a663f0c6f764ea19a7e7c9a0fc1813c292c75afc67dba2573e5e01f8afeba2b404ae4c3688889efe53952c965c07972aefb08736de7d479e5e00',
      rawTransaction:
        '0xf8a481e5a0a06eb1780f9e8c0c3a86158f55c315b60966d64a3020bcbe0e3572ee67e2ca51884563918244f400008087057af012d04cb08252088800000002540be40001b8603e32a141e28f99a3a6b4e7ebc2aab9cba2394e3f41b1905ddf42af169cc6ff8da5eaa094f819a663f0c6f764ea19a7e7c9a0fc1813c292c75afc67dba2573e5e01f8afeba2b404ae4c3688889efe53952c965c07972aefb08736de7d479e5e00'
    }
  ],
  cashedTransactions: [],
  hardwareWalletAddress: '',
  wallet: undefined,
  availableFunds: 0,
  sendTxComplete: false
};

export function appState(state = initialState, action = {}) {
  switch (action.type) {
    case SIGNED_TX_FETCHED:
      return {
        ...state,
        signedTransactions: action.payload
      };
    case SIGNED_TX_CAHSED:
      return {
        ...state,
        cashedTransactions: action.payload
      };
    case WALLET_CREATED:
      return {
        ...state,
        wallet: action.payload
      };
    case SEND_TX_COMPLETE:
      return {
        ...state,
        sendTxComplete: action.payload
      };
    case UPDATE_FUNDS:
      return {
        ...state,
        availableFunds: action.payload
      };
    default:
      return state;
  }
}
