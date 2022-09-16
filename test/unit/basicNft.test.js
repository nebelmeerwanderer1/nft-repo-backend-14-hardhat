const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network, gasReporter } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("basicNft unit test", function () {
          let basicNft, deployer, TOKEN_URI, basicNftMintNft, basicNftTokenCounter

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("basicNft")
          })

          describe("constructor", function () {
              it("initializes basicNft correctly", async function () {
                  basicNftTokenCounter = await basicNft.getTokenCounter()
                  assert.equal(basicNftTokenCounter.toString(), "0")
              })
          })

          describe("mintNft", function () {
              it("mints NFTs and increases counter by 1", async function () {
                  basicNftMintNft = await basicNft.mintNft()
                  basicNftTokenCounter = (await basicNft.getTokenCounter()) - 1
                  assert.equal(basicNftTokenCounter.toString(), basicNftMintNft.value.toString())
              })

              it("links the NFT to the tokenURI", async function () {
                  basicNftMintNft = await basicNft.mintNft()
                  tokenURI = await basicNft.tokenURI(basicNftMintNft.value)
                  //   console.log(tokenURI)
                  //   console.log(await basicNft.TOKEN_URI())
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })
          })
      })
