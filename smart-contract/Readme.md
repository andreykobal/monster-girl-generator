# NFT Marketplace Smart Contract

This repository contains the `NFTMarketplace.sol` smart contract for deploying an NFT marketplace on the Ethereum network using Remix IDE.

## Prerequisites

- **Remix IDE:** Use the [Remix Online IDE](https://remix.ethereum.org/) to compile and deploy your smart contract.
- **Ethereum Wallet:** MetaMask or another wallet extension configured for your target network (e.g., Ethereum Mainnet, Rinkeby, etc.).
- **Solidity Compiler:** Ensure the compiler version in Remix matches the version specified in your contract (check the `pragma solidity` line).

## Deployment Steps

1. **Open Remix IDE:**
   - Navigate to [Remix IDE](https://remix.ethereum.org/).

2. **Import the Contract:**
   - In the Remix file explorer, create a new file named `NFTMarketplace.sol`.
   - Copy and paste your smart contract code into the file.

3. **Compile the Contract:**
   - Click on the **Solidity Compiler** tab.
   - Select the appropriate compiler version.
   - Click **Compile NFTMarketplace.sol** to compile your contract.

4. **Deploy the Contract:**
   - Switch to the **Deploy & Run Transactions** tab.
   - Select your desired environment:
     - **JavaScript VM** for local testing.
     - **Injected Web3** to deploy using MetaMask.
   - Choose the `NFTMarketplace` contract from the dropdown.
   - Click **Deploy**.
   - Confirm the transaction in your wallet if required.

5. **Interact with Your Contract:**
   - After deployment, use the Remix interface to call contract functions and interact with your NFT marketplace.

## Troubleshooting

- **Compilation Errors:** Verify that the selected Solidity version in Remix matches your contract's pragma.
- **Deployment Issues:** Ensure your wallet is connected, the network is correct, and you have enough gas for the transaction.

## License

This project is licensed under the MIT License.

Happy coding!