const { network, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    
    log("----------------------------------------------------")

    arguments = []
    const customUri = await deploy("customUri", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        args: arguments,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(customUri.address, args)
    }
}

module.exports.tags = ["all", "customuri", "main"]
