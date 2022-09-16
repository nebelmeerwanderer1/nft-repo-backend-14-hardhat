const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log("--------------------------------------------")
    // Basic NFT
    const basicNft = await ethers.getContract("basicNft", deployer)
    const basicMintTx = await basicNft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`)

    // Dynamic SVG  NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("dynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    await dynamicSvgNftMintTx.wait(1)
    //console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)

    // random ipfs  NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    // Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minute timeout time
        // setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            resolve()
        })
        if (chainId == 31337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
    console.log("--------------------------------------------")
    // customuri  NFT
    const tokenUri = "https://gateway.pinata.cloud/ipfs/QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo"
    const customUri = await ethers.getContract("customUri", deployer)
    const customUriMintTx = await customUri.mintNFT(deployer, tokenUri)
    await customUriMintTx.wait(1)
    console.log(`Custom URI NFT index 0 tokenURI: ${await customUri.tokenURI(0)}`)

    // customuri NFT Update 
    const tokenUriupdate = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
    const customUriUpdateTx = await customUri.updateNFT(deployer, customUriMintTx.v, tokenUriupdate)
    await customUriUpdateTx.wait(1)
    console.log(`Updated Custom URI NFT index 0 tokenURI: ${await customUri.tokenURI(0)}`)

}
module.exports.tags = ["all", "mint"]
