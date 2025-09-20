import type { EVMABIMethod, EVMContract } from '@/store/collections'

const generateReadFunction = (method: EVMABIMethod) => {
  const inputs = method.inputs.map((_, index) => `input_${index}`).join(', ')

  let code = ''

  code += `\n\nasync function ${method.name}(${inputs}) {\n`
  code += `  const result = await contract.methods.${method.name}(${inputs}).call();\n`
  code += `  console.log("result:", result);\n`
  code += `}`

  return code
}

const generateWriteFunction = (method: EVMABIMethod) => {
  const inputs = method.inputs.map((_, index) => `input_${index}`).join(', ')

  let code = ''

  code += `\n\nasync function ${method.name}(${inputs}) {\n`
  code += `  const receipt = await contract.methods.${method.name}(${inputs}).send({ from: account.address });\n`
  code += `  console.log("receipt:", receipt);\n`
  code += `}`

  return code
}

export function generate(contract: EVMContract): string {
  const abi = contract.contract?.abi ? (JSON.parse(contract.contract?.abi) as EVMABIMethod[]) : []

  let code = ''

  // import libraries
  code += `const { Web3 } = require("web3");\n\n`
  // define variables
  code += `const providerUrl = "providerUrl";\n`
  code += `const privateKey = "privateKey";\n`
  code += `const deployedAddress = "${contract.contract?.address ?? 'deployedAddress'}";\n`
  code += `const abi = ${
    abi.length
      ? JSON.stringify(
          abi.filter((item) => item.type === 'function'),
          null,
          2,
        )
      : 'abi'
  };\n\n`
  // define provider
  code += `const provider = new Web3.providers.HttpProvider(providerUrl);\n`
  code += `const web3 = new Web3(provider);\n\n`
  // define signer
  code += `const account = web3.eth.accounts.wallet.add(privateKey).get(0);\n\n`
  // define contract
  code += `const contract = new web3.eth.Contract(abi, deployedAddress);`

  for (const method of abi.filter((item) => item.type === 'function')) {
    if (method.stateMutability === 'view' || method.stateMutability === 'pure') {
      code += generateReadFunction(method)
    } else {
      code += generateWriteFunction(method)
    }
  }

  return code
}
