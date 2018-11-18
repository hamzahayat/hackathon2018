import { INCOMING_REQUEST, INCOMING_REPLY } from '../actions/web3Provider';

const initialState = {
  currentProviderName: 'Mastery',
  incomingRequestObj: undefined,
  incomingReplyObj: undefined
};

export function web3Provider(state = initialState, action = {}) {
  switch (action.type) {
    case INCOMING_REQUEST:
      return {
        ...state,
        incomingRequestObj: action.payload
      };
    case INCOMING_REPLY:
      return {
        ...state,
        incomingReplyObj: action.payload
      };
    default:
      return state;
  }
}
