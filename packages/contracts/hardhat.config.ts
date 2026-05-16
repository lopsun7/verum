import { config as loadEnv } from "dotenv";
import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

loadEnv();

export default defineConfig({
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    ethereum: {
      type: "http",
      url: process.env.RPC_URL ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
});
