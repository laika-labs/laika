import { formatAbi } from 'abitype'

import type { EVMABIMethod, EVMContract } from '@/store/collections'

const generateReadFunction = (method: EVMABIMethod) => {
  const inputs = method.inputs.map((_, index) => `input_${index}`).join(', ')

  let code = ''

  code += `\n\nasync function ${method.name}(${inputs}) {\n`
  code += `  const result = await contract.${method.name}(${inputs});\n`
  code += `  console.log("result:", result);\n`
  code += `}`

  return code
}

const generateWriteFunction = (method: EVMABIMethod) => {
  const inputs = method.inputs.map((_, index) => `input_${index}`).join(', ')

  let code = ''

  code += `\n\nasync function ${method.name}(${inputs}) {\n`
  code += `  const tx = await contract.${method.name}(${inputs});\n`
  code += `  const receipt = await tx.wait();\n`
  code += `  console.log("receipt:", receipt);\n`
  code += `}`

  return code
}

export function generate(contract: EVMContract): string {
  const abi = contract.contract?.abi ? (JSON.parse(contract.contract?.abi) as EVMABIMethod[]) : []

  let code = ''

  // import libraries
  code += `import { ethers } from "ethers";\n\n`
  // define variables
  code += `const providerUrl = "providerUrl";\n`
  code += `const privateKey = "privateKey";\n`
  code += `const deployedAddress = "${contract.contract?.address ?? 'deployedAddress'}";\n`
  code += `const abi = ${
    abi.length ? JSON.stringify(formatAbi(abi.filter((item) => item.type === 'function')), null, 2) : 'abi'
  };\n\n`
  // define provider
  code += `const provider = new ethers.JsonRpcProvider(providerUrl);\n\n`
  // define signer
  code += `const signer = new ethers.Wallet(privateKey, provider);\n\n`
  // define contract
  code += `const contract = new ethers.Contract(deployedAddress, abi, signer);`

  for (const method of abi.filter((item) => item.type === 'function')) {
    if (method.stateMutability === 'view' || method.stateMutability === 'pure') {
      code += generateReadFunction(method)
    } else {
      code += generateWriteFunction(method)
    }
  }

  return code
}
