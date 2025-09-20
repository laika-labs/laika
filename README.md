# Laika

Laika is a request builder for web3 - like Postman for blockchains. It allows you to interact with smart contracts without writing code, supporting all EVM-compatible blockchains with universal UI for ABIs.

## Features

- **Multi-Blockchain Support**: Compatible with all EVM compatible blockchains
- **Smart Contract Interaction**: Universal UI for every ABI with read/write method support
- **Request Management**: Send and sign transactions using multiple wallets via [RainbowKit](https://www.rainbowkit.com/)
- **Collections & Organization**: Hierarchical project organization (Collections → Folders → Smart Contracts)
- **Code Generation**: Generate JavaScript code snippets (web3.js, ethers.js) from contract interactions
- **Integrated Documentation**: Built-in ABI documentation viewer with Monaco Editor
- **Multi-tab Workspace**: Manage multiple contract requests simultaneously

## Tech Stack

- React 19 + TypeScript + Vite
- TanStack Router (file-based routing)
- Zustand (state management with persistence)
- Tailwind CSS v4 + shadcn/ui components
- wagmi + viem + RainbowKit (Web3 integration)
- Monaco Editor (code/ABI display)

## Installation

```bash
git clone https://github.com/laika-labs/laika
cd laika
bun install
bun run dev
```

## Development Commands

- **Development server**: `bun run dev`
- **Build**: `bun run build`
- **Linting**: `bun run lint`
- **Formatting**: `bun run format`
- **Preview build**: `bun run preview`

## Usage

1. **Connect Wallet**: Select your network.
2. **Contract Interaction**: Enter a contract address. Laika fetches the ABI and displays methods.
3. **Execute Requests**: Fill parameters, send requests, and view responses.
4. **Manage Tabs**: Manage all requests through tabs on the workspace

## Documentation

For more detailed documentation, please visit [https://docs.getlaika.app/](https://docs.getlaika.app/). You can also watch this [video tutorial](https://www.youtube.com/watch?v=X_MSM0Lk4CM) on how to use Laika.

## Contributing

Laika is an open source project and we welcome contributions from the community. If you want to report a bug, request a feature, or submit a pull request, please use the [issue tracker](https://github.com/laika-labs/laika/issues) and the [code repository](https://github.com/laika-labs/laika) on GitHub.

## License

Laika is licensed under the MIT License. See the [LICENSE](https://github.com/laika-labs/laika/blob/main/LICENSE) file for more details.
