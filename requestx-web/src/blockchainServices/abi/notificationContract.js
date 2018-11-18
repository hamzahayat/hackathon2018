export const NOTIFICATION_CONTRACT_ADDRESS =
  '0xa0a2e5f1f0b3d5db6c2bb5384c01786343670519e9bdf313780641496251f777';
export const NOTIFICATION_CONTRACT_ABI = [
  {
    outputs: [],
    constant: false,
    payable: false,
    inputs: [
      {
        name: 'reqFrom',
        type: 'string'
      },
      {
        name: 'reqTo',
        type: 'string'
      },
      {
        name: 'txHash',
        type: 'string'
      },
      {
        name: 'status',
        type: 'bool'
      },
      {
        name: 'reqValue',
        type: 'uint128'
      }
    ],
    name: 'requestAnswered',
    type: 'function'
  },
  {
    outputs: [],
    constant: false,
    payable: false,
    inputs: [
      {
        name: 'reqFrom',
        type: 'string'
      },
      {
        name: 'reqTo',
        type: 'string'
      },
      {
        name: 'reqValue',
        type: 'uint128'
      }
    ],
    name: 'sendRequest',
    type: 'function'
  },
  {
    outputs: [],
    inputs: [
      {
        indexed: false,
        name: 'reqFrom',
        type: 'string'
      },
      {
        indexed: false,
        name: 'reqTo',
        type: 'string'
      },
      {
        indexed: false,
        name: 'reqValue',
        type: 'uint128'
      }
    ],
    name: 'IncomingRequest',
    anonymous: false,
    type: 'event'
  },
  {
    outputs: [],
    inputs: [
      {
        indexed: false,
        name: 'reqFrom',
        type: 'string'
      },
      {
        indexed: false,
        name: 'reqTo',
        type: 'string'
      },
      {
        indexed: false,
        name: 'txHash',
        type: 'string'
      },
      {
        indexed: false,
        name: 'status',
        type: 'bool'
      },
      {
        indexed: false,
        name: 'reqValue',
        type: 'uint128'
      }
    ],
    name: 'RequestAnswered',
    anonymous: false,
    type: 'event'
  }
];
