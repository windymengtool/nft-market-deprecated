const {ethers, upgrades} = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("deployer: ", deployer.address)

    // 部署 NFT 合约
    // let TestERC721 = await ethers.getContractFactory("TestERC721")
    // const testERC721 = await TestERC721.deploy()
    // await testERC721.deployed()
    // console.log("testERC721 contract deployed to:", testERC721.address)

    //mint
    let testERC721Address = "0x4460376b7048848FDf40113e779F0b36630c9455"; // 上一步部署合约得到的地址
    let testERC721 = await (await ethers.getContractFactory("TestERC721")).attach(testERC721Address)
    // `_mint(address to, uint256 tokenId)`
    tx = await testERC721.mint(deployer.address, 0); // 为 [deployer.address] 铸造一个tokenId=0 的NFT
    await tx.wait()
    console.log("mint tx:", tx.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
