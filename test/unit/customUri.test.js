const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network, gasReporter } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("customUri unit test", function () {
          let customUri, deployer, tokenUri, customUriMintNft, customUriTokenCounter, player

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              player = (await getNamedAccounts()).player
              await deployments.fixture(["customuri"])
              customUri = await ethers.getContract("customUri")
          })

        describe("mintNFT", function () {
              it("mints NFTs and increases counter by 1", async function () {
                  tokenUri = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                  customUriMintNft = await customUri.mintNFT(deployer, tokenUri)
                  customUriTokenCounter = (await customUri.getTokenCounter()) - 1
                  assert.equal(customUriTokenCounter.toString(), customUriMintNft.value.toString())
              })

              it("emits an event with correct information", async function () {
                tokenUri = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                await expect(customUri.mintNFT(deployer, tokenUri)).to.emit(
                      customUri, "CreatedNFT").withArgs(0, anyValue, deployer)
                   
              })
        })

        describe("updateNFT", function () {
              it("reverts if the tokenId is not minted", async function () {
                tokenId = 0
                tokenUri = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                await expect(customUri.updateNFT(tokenId, tokenUri)).to.be.reverted;              
              })

              it("reverts if the sender is not the owner", async function () {
                tokenUri1 = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                await customUri.mintNFT(deployer, tokenUri)
                await customUri.transferFrom(deployer, player, 0)
                tokenUri2 = "https://gateway.pinata.cloud/ipfs/QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo"
                await expect(customUri.updateNFT(tokenId, tokenUri)).to.be.revertedWith("NotOwnerOfNFT")                  
              })

              it("sets a new tokenURI", async function () {
                tokenUri = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                await customUri.mintNFT(deployer, tokenUri)
                tokenUri2 = "https://gateway.pinata.cloud/ipfs/QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo"
                await customUri.updateNFT(tokenId, tokenUri2)
                assert.equal(await customUri.tokenURI(tokenId), tokenUri2)                 
              })

              it("emits UpdatedTokenUri event", async function () {
                tokenUri = "https://gateway.pinata.cloud/ipfs/QmZj9J4t7W3JGTawSKkhKnyiWyyBVX6hgWb35tnWs74XFz"
                await customUri.mintNFT(deployer, tokenUri)
                tokenUri2 = "https://gateway.pinata.cloud/ipfs/QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo"
                await expect(customUri.updateNFT(tokenId, tokenUri2)).to.emit(
                      customUri, "UpdatedTokenUri").withArgs(0, tokenUri2, deployer)                   
              })
        })



    })