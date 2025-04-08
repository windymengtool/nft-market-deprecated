require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")
require('hardhat-contract-sizer')
require('@openzeppelin/hardhat-upgrades')
require('solidity-coverage')

// config
const {config: dotenvConfig} = require("dotenv")
const {resolve} = require("path")
dotenvConfig({path: resolve(__dirname, "./.env")})

// const SEPOLIA_ALCHEMY_PK_ONE = process.env.SEPOLIA_ALCHEMY_PK_ONE
// const SEPOLIA_ALCHEMY_PK_TWO = process.env.SEPOLIA_ALCHEMY_PK_TWO
const SEPOLIA_INFURA_PK_ONE = process.env.SEPOLIA_INFURA_PK_ONE
const SEPOLIA_INFURA_PK_TWO = process.env.SEPOLIA_INFURA_PK_TWO
if (!SEPOLIA_INFURA_PK_ONE) {
    throw new Error("Please set SEPOLIA_INFURA_PK_ONE in a .env file")
}

// const MAINNET_PK = process.env.MAINNET_PK
// const MAINNET_ALCHEMY_AK = process.env.MAINNET_ALCHEMY_AK

// const SEPOLIA_ALCHEMY_AK = process.env.SEPOLIA_ALCHEMY_AK
const SEPOLIA_INFURA_AK = process.env.SEPOLIA_INFURA_AK
if (!SEPOLIA_INFURA_AK) {
    throw new Error("Please set SEPOLIA_INFURA_AK in a .env file")
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: '0.8.20',
        settings: {
            optimizer: {
                enabled: true,
                runs: 50,
            },
            viaIR: true,
        },
        metadata: {
            bytecodeHash: 'none',
        }
    },
    networks: {
        // mainnet: {
        //     url: `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_ALCHEMY_AK}`,
        //     accounts: [`${MAINNET_PK}`],
        //     saveDeployments: true,
        //     chainId: 1,
        // },
        // sepolia_alchemy: {
        //     url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_ALCHEMY_AK}`,
        //     accounts: [`${SEPOLIA_ALCHEMY_PK_ONE}`, `${SEPOLIA_ALCHEMY_PK_TWO}`],
        // },
        sepolia_infura: {
            url: `https://sepolia.infura.io/v3/${SEPOLIA_INFURA_AK}`,
            accounts: [`${SEPOLIA_INFURA_PK_ONE}`, `${SEPOLIA_INFURA_PK_TWO}`],
        },
        // optimism: {
        //   url: `https://rpc.ankr.com/optimism`,
        //   accounts: [`${MAINNET_PK}`],
        // },
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS ? true : false,
        excludeContracts: [],
        src: "./contracts",
    },
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
}
