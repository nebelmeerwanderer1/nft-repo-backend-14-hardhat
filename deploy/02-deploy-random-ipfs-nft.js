const { network, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig, } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

const FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        // get VRF coordinator V2 mock address
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        //Create mock subscriptionId and fund
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId

        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const mintFee = "100000000"
    const dogTokenUris = ["xxx", "xxx", "xxx"]

    let tokenUris = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
]

    log("----------------------------------------------------")

    //console.log(`Mockprice: ${mockPrice.toString()}`)

    arguments = [vrfCoordinatorV2Address, subscriptionId, networkConfig[chainId]["gasLane"], networkConfig[chainId]["mintFee"], networkConfig[chainId]["callbackGasLimit"], dogTokenUris]
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        args: arguments,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, args)
    }
}

module.exports.tags = ["all", "randomipfsnft", "main"]
