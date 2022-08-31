const { network, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const lowSVG = await fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" })
    const highSVG = await fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" })

    log("----------------------------------------------------")

    //console.log(`Mockprice: ${mockPrice.toString()}`)

    arguments = [ethUsdPriceFeedAddress, lowSVG, highSVG]
    const dynamicSvgNft = await deploy("dynamicSvgNft", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        args: arguments,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(dynamicSvgNft.address, args)
    }
}

module.exports.tags = ["all", "dynamicsvgnft", "main"]
