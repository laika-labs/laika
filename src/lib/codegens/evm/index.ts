import { generate as jsEthers } from './js-ethers'
import { generate as jsWeb3 } from './js-web3'

export const codegens = [
  { name: 'JS - Ethers.js (v6)', language: 'javascript', generate: jsEthers },
  { name: 'JS - Web3.js (v4)', language: 'javascript', generate: jsWeb3 },
]
