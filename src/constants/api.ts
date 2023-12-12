export const getabi: Record<string, string> = {
  'https://etherscan.io': 'https://api.etherscan.io/api?module=contract&action=getabi&address=${address}',
  'https://goerli.etherscan.io': 'https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${address}',
  'https://sepolia.etherscan.io':
    'https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}',
  'https://bscscan.com': 'https://api.bscscan.com/api?module=contract&action=getabi&address=${address}',
  'https://testnet.bscscan.com': 'https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${address}',
  'https://polygonscan.com': 'https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}',
  'https://mumbai.polygonscan.com':
    'https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${address}',
  'https://optimistic.etherscan.io':
    'https://api-optimistic.etherscan.io/api?module=contract&action=getabi&address=${address}',
  'https://arbiscan.io': 'https://api.arbiscan.io/api?module=contract&action=getabi&address=${address}',
  'https://goerli.arbiscan.io': 'https://api-goerli.arbiscan.io/api?module=contract&action=getabi&address=${address}',
}
