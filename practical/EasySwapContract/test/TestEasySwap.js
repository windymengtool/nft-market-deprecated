// 导入必要的测试库和工具
const { expect } = require("chai")          // 引入chai断言库
const { ethers, upgrades } = require("hardhat")  // 引入hardhat的ethers和upgrades工具
const { toBn } = require("evm-bn")          // 引入evm-bn用于处理大数字
const { Side, SaleKind } = require("./common")   // 引入订单类型枚举
const { exp } = require("@prb/math")        // 引入数学库

// 定义测试账户变量
let owner, addr1, addr2, addrs

// 定义合约实例变量
let esVault        // EasySwapVault合约实例
let esDex          // EasySwapOrderBook合约实例
let testERC721     // 测试用ERC721合约实例
let testLibOrder   // 测试用LibOrder合约实例

// 定义常量
const AddressZero = "0x0000000000000000000000000000000000000000";  // 零地址常量
const Byte32Zero = "0x0000000000000000000000000000000000000000000000000000000000000000";  // 32字节零值常量
const Uint128Max = toBn("340282366920938463463.374607431768211455");  // uint128最大值
const Uint256Max = toBn("115792089237316195423570985008687907853269984665640564039457.584007913129639935");  // uint256最大值


describe("EasySwap Test", function () {
    // 在每个测试用例之前运行的设置
    beforeEach(async function () {
        // 获取测试账户
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // 获取合约工厂
        esVault = await ethers.getContractFactory("EasySwapVault")        // Vault合约工厂
        esDex = await ethers.getContractFactory("EasySwapOrderBook")      // OrderBook合约工厂
        testERC721 = await ethers.getContractFactory("TestERC721")        // 测试用ERC721合约工厂
        testLibOrder = await ethers.getContractFactory("LibOrderTest")     // 测试用LibOrder合约工厂

        // 部署合约
        testLibOrder = await testLibOrder.deploy()                         // 部署LibOrder测试合约
        testERC721 = await testERC721.deploy()                            // 部署ERC721测试合约
        // 使用代理模式部署Vault合约
        esVault = await upgrades.deployProxy(esVault, { initializer: 'initialize' });

        // 设置OrderBook合约的初始化参数
        newProtocolShare = 200;                // 设置协议费率
        newESVault = esVault.address          // Vault合约地址
        EIP712Name = "EasySwapOrderBook"      // EIP712域名
        EIP712Version = "1"                   // EIP712版本
        // 使用代理模式部署OrderBook合约
        esDex = await upgrades.deployProxy(esDex, [newProtocolShare, newESVault, EIP712Name, EIP712Version], { initializer: 'initialize' });

        // 铸造测试用NFT
        nft = testERC721.address
        await testERC721.mint(owner.address, 0)
        await testERC721.mint(owner.address, 1)
        await testERC721.mint(owner.address, 2)
        await testERC721.mint(owner.address, 3)
        await testERC721.mint(owner.address, 4)
        await testERC721.mint(owner.address, 5)
        await testERC721.mint(owner.address, 6)
        await testERC721.mint(owner.address, 7)
        await testERC721.mint(owner.address, 8)
        await testERC721.mint(owner.address, 9)
        await testERC721.mint(owner.address, 10)
        await testERC721.mint(owner.address, 11)
        
        // 授权Vault合约操作NFT
        testERC721.setApprovalForAll(esVault.address, true)

        // 设置OrderBook合约地址到Vault合约
        await esVault.setOrderBook(esDex.address)
    })

    // 测试模块1：合约初始化测试
    describe("should initialize successfully", async () => {
        // 测试合约初始化是否成功
        it("should initialize successfully", async () => {
            info = await esDex.eip712Domain();
            expect(info.name).to.equal(EIP712Name)      // 验证EIP712域名是否正确
            expect(info.version).to.equal(EIP712Version) // 验证EIP712版本是否正确
        })
    })

    // 测试模块2：订单创建功能测试
    describe("should make order successfully", async () => {
        // 测试创建卖单(List)功能
        it("should make list/sell order successfully", async () => {
            // 创建卖单参数
            const now = parseInt(new Date() / 1000) + 100000  // 设置订单过期时间
            const salt = 1;                                    // 设置随机数
            const nftAddress = testERC721.address;            // NFT合约地址
            const tokenId = 0;                                // NFT的tokenId
            const nftAmount = 1;                              // NFT数量
            const order = {
                side: Side.List,                              // 订单类型：卖单
                saleKind: SaleKind.FixedPriceForItem,        // 销售类型：固定价格
                maker: owner.address,                         // 订单创建者
                nft: [tokenId, nftAddress, 1],               // NFT信息
                price: toBn("0.01"),                         // 价格：0.01 ETH
                expiry: now,                                 // 过期时间
                salt: salt,                                  // 随机数
            }
            const orders = [order];

            // 验证订单创建
            orderKeys = await esDex.callStatic.makeOrders(orders)
            expect(orderKeys[0]).to.not.equal(Byte32Zero)    // 验证订单ID不为零

            // 验证订单创建事件
            await expect(await esDex.makeOrders(orders))
                .to.emit(esDex, "LogMake")

            // 验证订单信息
            const orderHash = await testLibOrder.getOrderHash(order)
            dbOrder = await esDex.orders(orderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)
            expect(await testERC721.ownerOf(0)).to.equal(esVault.address)  // 验证NFT已转入Vault
        })

        it("should make list/sell order and return orders successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order];

            orderKeys = await esDex.callStatic.makeOrders(orders)
            expect(orderKeys[0]).to.not.equal(Byte32Zero)

        })

        it("should make bid/buy order successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order];

            orderKeys = await esDex.callStatic.makeOrders(orders, { value: toBn("0.02") })
            expect(orderKeys[0]).to.not.equal(Byte32Zero)

            await expect(await esDex.makeOrders(orders, { value: toBn("0.02") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.01"), toBn("0.01")]);

            const orderHash = await testLibOrder.getOrderHash(order)
            // console.log("orderHash: ", orderHash)

            dbOrder = await esDex.orders(orderHash)
            // console.log("dbOrder: ", dbOrder)
            expect(dbOrder.order.maker).to.equal(owner.address)
        })

        it("should make two side order successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const listOrder = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            const bidOrder = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [listOrder, bidOrder];

            orderKeys = await esDex.callStatic.makeOrders(orders, { value: toBn("0.02") })
            expect(orderKeys[0]).to.not.equal(Byte32Zero)
            expect(orderKeys[1]).to.not.equal(Byte32Zero)

            await expect(await esDex.makeOrders(orders, { value: toBn("0.02") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.01"), toBn("0.01")]);

            const listOrderHash = await testLibOrder.getOrderHash(listOrder)
            dbOrder = await esDex.orders(listOrderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)
            expect(await testERC721.ownerOf(0)).to.equal(esVault.address)

            const bidOrderHash = await testLibOrder.getOrderHash(bidOrder)
            dbOrder2 = await esDex.orders(bidOrderHash)
            expect(dbOrder2.order.maker).to.equal(owner.address)
        })
    })

    describe("should cancel order successfully", async () => {
        it("should cancel list order successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order];


            await expect(await esDex.makeOrders(orders))
                .to.emit(esDex, "LogMake")

            const orderHash = await testLibOrder.getOrderHash(order)
            // console.log("orderHash: ", orderHash)

            dbOrder = await esDex.orders(orderHash)
            // console.log("dbOrder: ", dbOrder)
            expect(dbOrder.order.maker).to.equal(owner.address)


            successes = await esDex.callStatic.cancelOrders([orderHash])
            expect(successes[0]).to.equal(true)


            // tx = await esDex.cancelOrders([orderHash])
            // txRec = await tx.wait()
            // console.log("txRec: ", txRec.logs)

            await expect(await esDex.cancelOrders([orderHash]))
                .to.emit(esDex, "LogCancel")

            stat = await esDex.filledAmount(orderHash)
            expect(stat).to.equal(Uint256Max)
        })

        it("should cancel bid order successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 5],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order];

            // await expect(await esDex.makeOrders(orders, { value: toBn("0.05") }))
            //     .to.emit(esDex, "LogMake")

            await expect(await esDex.makeOrders(orders, { value: toBn("0.07") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.05"), toBn("0.05")]);

            const orderHash = await testLibOrder.getOrderHash(order)
            // console.log("orderHash: ", orderHash)

            dbOrder = await esDex.orders(orderHash)
            // console.log("dbOrder: ", dbOrder)
            expect(dbOrder.order.maker).to.equal(owner.address)


            successes = await esDex.callStatic.cancelOrders([orderHash])
            expect(successes[0]).to.equal(true)

            // await expect(await esDex.cancelOrders([orderHash]))
            //     .to.emit(esDex, "LogCancel")

            await expect(await esDex.cancelOrders([orderHash]))
                .to.changeEtherBalances([owner, esVault], [toBn("0.05"), toBn("-0.05")]);

            stat = await esDex.filledAmount(orderHash)
            expect(stat).to.equal(Uint256Max)
        })

        async function perparePartlyFilledOrder() {
            //bid order
            let now = parseInt(new Date() / 1000) + 10000000000
            let salt = 1;
            let nftAddress = testERC721.address;
            let tokenId = 1;
            let buyOrder = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: addr1.address,
                nft: [tokenId, nftAddress, 4],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            await expect(await esDex.connect(addr1).makeOrders([buyOrder], { value: toBn("0.04") }))
                .to.emit(esDex, "LogMake")

            const orderHash = await testLibOrder.getOrderHash(buyOrder)
            // console.log("buy orderHash: ", orderHash)

            const dbOrder = await esDex.orders(orderHash)
            // console.log("buy order: ", dbOrder)

            // market sell
            now = parseInt(new Date() / 1000) + 100000
            salt = 2;
            nftAddress = testERC721.address;
            tokenId = 1;
            sellOrder = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            await expect(await esDex.matchOrder(sellOrder, buyOrder))
                .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
            expect(await testERC721.ownerOf(1)).to.equal(addr1.address)
            return orderHash
        }

        it("should cancel bid order partly filled successfully", async () => {
            orderHash = await perparePartlyFilledOrder();
            // console.log("orderHash: ", orderHash)

            await expect(await esDex.connect(addr1).cancelOrders([orderHash]))
                .to.emit(esDex, "LogCancel")

            stat = await esDex.filledAmount(orderHash)
            expect(stat).to.equal(Uint256Max)

            newETHBalance = await esVault.ETHBalance(orderHash);
            expect(newETHBalance).to.equal(toBn("0"))
        })
    })

    describe("should edit orders successfully", async () => {
        it("should edit list orders successfully", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 1;
            const order = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            tokenId2 = 2;
            order2 = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }
            const orders = [order, order2];

            await expect(await esDex.makeOrders(orders))
                .to.emit(esDex, "LogMake")

            const orderHash = await testLibOrder.getOrderHash(order)
            // console.log("orderHash: ", orderHash)

            const order2Hash = await testLibOrder.getOrderHash(order2)
            // console.log("order2Hash: ", order2Hash)

            dbOrder = await esDex.orders(orderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)

            dbOrder2 = await esDex.orders(order2Hash)
            expect(dbOrder2.order.maker).to.equal(owner.address)

            // edit
            newOrder = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }
            newOrder2 = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 1],
                price: toBn("0.04"),
                expiry: now,
                salt: 11,
            }

            editDetail1 = {
                oldOrderKey: orderHash,
                newOrder: newOrder,
            }
            editDetail2 = {
                oldOrderKey: order2Hash,
                newOrder: newOrder2,
            }

            editDetails = [editDetail1, editDetail2]

            newOrderKeys = await esDex.callStatic.editOrders(editDetails)
            expect(newOrderKeys[0]).to.not.equal(Byte32Zero)
            expect(newOrderKeys[1]).to.not.equal(Byte32Zero)

            editDetailsSkip = [editDetail1, editDetail1, editDetail2]
            newOrderKeys = await esDex.callStatic.editOrders(editDetailsSkip)
            expect(newOrderKeys[0]).to.not.equal(Byte32Zero)
            expect(newOrderKeys[1]).to.equal(Byte32Zero)
            expect(newOrderKeys[2]).to.not.equal(Byte32Zero)
            await esDex.editOrders(editDetails)

            const newOrderHash = await testLibOrder.getOrderHash(newOrder)
            newNFTBalance = await esVault.NFTBalance(newOrderHash);
            expect(newNFTBalance).to.equal(1)

            oldNFTBalance = await esVault.NFTBalance(orderHash);
            expect(oldNFTBalance).to.equal(0)

            const newOrder2Hash = await testLibOrder.getOrderHash(newOrder2)
            newNFT2Balance = await esVault.NFTBalance(newOrder2Hash);
            expect(newNFT2Balance).to.equal(2)

            oldNFT2Balance = await esVault.NFTBalance(order2Hash);
            expect(oldNFT2Balance).to.equal(0)

            newStat = await esDex.filledAmount(newOrderHash);
            expect(newStat).to.equal(0)
            oldStat = await esDex.filledAmount(orderHash);
            expect(oldStat).to.equal(Uint256Max)

            newStat2 = await esDex.filledAmount(newOrder2Hash);
            expect(newStat2).to.equal(0)
            oldStat2 = await esDex.filledAmount(order2Hash);
            expect(oldStat2).to.equal(Uint256Max)
        })

        it("should edit bid order successfully, all new price > old price", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            tokenId2 = 2;
            const order2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order1, order2];

            await expect(await esDex.makeOrders(orders, { value: toBn("0.04") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.02"), toBn("0.02")]);

            const orderHash = await testLibOrder.getOrderHash(order1)
            // console.log("orderHash: ", orderHash)
            const order2Hash = await testLibOrder.getOrderHash(order2)
            // console.log("order2Hash: ", order2Hash)

            dbOrder = await esDex.orders(orderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)

            dbOrder2 = await esDex.orders(order2Hash)
            expect(dbOrder2.order.maker).to.equal(owner.address)

            // edit
            newOrder1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 2],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            newOrder2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 2],
                price: toBn("0.03"),
                expiry: now,
                salt: salt,
            }

            editDetail1 = {
                oldOrderKey: orderHash,
                newOrder: newOrder1
            }
            editDetail2 = {
                oldOrderKey: order2Hash,
                newOrder: newOrder2
            }
            editDetails = [editDetail1, editDetail2]

            newOrderKeys = await esDex.callStatic.editOrders(editDetails, { value: toBn("0.09") })
            expect(newOrderKeys[0]).to.not.equal(Byte32Zero)
            expect(newOrderKeys[1]).to.not.equal(Byte32Zero)

            await expect(await esDex.editOrders(editDetails, { value: toBn("0.1") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.08"), toBn("0.08")]);

            const newOrderHash = await testLibOrder.getOrderHash(newOrder1)
            newStat = await esDex.filledAmount(newOrderHash);
            expect(newStat).to.equal(0)
            oldStat = await esDex.filledAmount(orderHash);
            expect(oldStat).to.equal(Uint256Max)

            const newOrder2Hash = await testLibOrder.getOrderHash(newOrder2)
            new2Stat = await esDex.filledAmount(newOrder2Hash);
            expect(newStat).to.equal(0)
            old2Stat = await esDex.filledAmount(order2Hash);
            expect(old2Stat).to.equal(Uint256Max)

            newETHBalance = await esVault.ETHBalance(newOrderHash);
            expect(newETHBalance).to.equal(toBn("0.04"))
            oldETHBalance = await esVault.ETHBalance(orderHash);
            expect(oldETHBalance).to.equal(0)

            newETHBalance2 = await esVault.ETHBalance(newOrder2Hash);
            expect(newETHBalance2).to.equal(toBn("0.06"))

            oldETHBalance2 = await esVault.ETHBalance(order2Hash);
            expect(oldETHBalance2).to.equal(0)
        })

        it("should edit bid order successfully, all new price < old price", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            tokenId2 = 2
            const order2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order1, order2];

            await expect(await esDex.makeOrders(orders, { value: toBn("0.04") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.02"), toBn("0.02")]);

            const orderHash = await testLibOrder.getOrderHash(order1)
            // console.log("orderHash: ", orderHash)
            const order2Hash = await testLibOrder.getOrderHash(order2)
            // console.log("order2Hash: ", order2Hash)

            dbOrder = await esDex.orders(orderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)

            dbOrder2 = await esDex.orders(order2Hash)
            expect(dbOrder2.order.maker).to.equal(owner.address)

            // edit
            newOrder1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 3],
                price: toBn("0.005"),
                expiry: now,
                salt: salt,
            }

            newOrder2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 5],
                price: toBn("0.006"),
                expiry: now,
                salt: salt,
            }

            editDetail1 = {
                oldOrderKey: orderHash,
                newOrder: newOrder1
            }
            editDetail2 = {
                oldOrderKey: order2Hash,
                newOrder: newOrder2
            }
            editDetails = [editDetail1, editDetail2]

            newOrderKeys = await esDex.callStatic.editOrders(editDetails, { value: toBn("0.04") })
            expect(newOrderKeys[0]).to.not.equal(Byte32Zero)
            expect(newOrderKeys[1]).to.not.equal(Byte32Zero)

            await expect(await esDex.editOrders(editDetails, { value: toBn("0.04") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.025"), toBn("0.025")]);

            const newOrderHash = await testLibOrder.getOrderHash(newOrder1)
            newStat = await esDex.filledAmount(newOrderHash);
            expect(newStat).to.equal(0)
            oldStat = await esDex.filledAmount(orderHash);
            expect(oldStat).to.equal(Uint256Max)

            const newOrder2Hash = await testLibOrder.getOrderHash(newOrder2)
            new2Stat = await esDex.filledAmount(newOrder2Hash);
            expect(newStat).to.equal(0)
            old2Stat = await esDex.filledAmount(order2Hash);
            expect(old2Stat).to.equal(Uint256Max)

            newETHBalance = await esVault.ETHBalance(newOrderHash);
            expect(newETHBalance).to.equal(toBn("0.015"))
            oldETHBalance = await esVault.ETHBalance(orderHash);
            expect(oldETHBalance).to.equal(0)

            newETHBalance2 = await esVault.ETHBalance(newOrder2Hash);
            expect(newETHBalance2).to.equal(toBn("0.03"))

            oldETHBalance2 = await esVault.ETHBalance(order2Hash);
            expect(oldETHBalance2).to.equal(0)
        })

        it("should edit bid order successfully, order one: new price < old price, order two: new price > old price", async () => {
            const now = parseInt(new Date() / 1000) + 100000
            const salt = 1;
            const nftAddress = testERC721.address;
            const tokenId = 0;
            const order1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            tokenId2 = 2
            const order2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }
            const orders = [order1, order2];

            await expect(await esDex.makeOrders(orders, { value: toBn("0.04") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.02"), toBn("0.02")]);

            const orderHash = await testLibOrder.getOrderHash(order1)
            // console.log("orderHash: ", orderHash)
            const order2Hash = await testLibOrder.getOrderHash(order2)
            // console.log("order2Hash: ", order2Hash)

            dbOrder = await esDex.orders(orderHash)
            expect(dbOrder.order.maker).to.equal(owner.address)

            dbOrder2 = await esDex.orders(order2Hash)
            expect(dbOrder2.order.maker).to.equal(owner.address)

            // edit
            newOrder1 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 2],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            newOrder2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId2, nftAddress, 3],
                price: toBn("0.002"),
                expiry: now,
                salt: salt,
            }

            editDetail1 = {
                oldOrderKey: orderHash,
                newOrder: newOrder1
            }
            editDetail2 = {
                oldOrderKey: order2Hash,
                newOrder: newOrder2
            }
            editDetails = [editDetail1, editDetail2]

            newOrderKeys = await esDex.callStatic.editOrders(editDetails, { value: toBn("0.04") })
            expect(newOrderKeys[0]).to.not.equal(Byte32Zero)
            expect(newOrderKeys[1]).to.not.equal(Byte32Zero)

            await expect(await esDex.editOrders(editDetails, { value: toBn("0.04") }))
                .to.changeEtherBalances([owner, esVault], [toBn("-0.026"), toBn("0.026")]);

            const newOrderHash = await testLibOrder.getOrderHash(newOrder1)
            newStat = await esDex.filledAmount(newOrderHash);
            expect(newStat).to.equal(0)
            oldStat = await esDex.filledAmount(orderHash);
            expect(oldStat).to.equal(Uint256Max)

            const newOrder2Hash = await testLibOrder.getOrderHash(newOrder2)
            new2Stat = await esDex.filledAmount(newOrder2Hash);
            expect(newStat).to.equal(0)
            old2Stat = await esDex.filledAmount(order2Hash);
            expect(old2Stat).to.equal(Uint256Max)

            newETHBalance = await esVault.ETHBalance(newOrderHash);
            expect(newETHBalance).to.equal(toBn("0.04"))
            oldETHBalance = await esVault.ETHBalance(orderHash);
            expect(oldETHBalance).to.equal(0)

            newETHBalance2 = await esVault.ETHBalance(newOrder2Hash);
            expect(newETHBalance2).to.equal(toBn("0.006"))

            oldETHBalance2 = await esVault.ETHBalance(order2Hash);
            expect(oldETHBalance2).to.equal(0)
        })
    })

    describe("should match order successfully", async () => {
        // 测试订单匹配条件检查
        describe("should check match available successfully", async () => {
            // 测试匹配卖单
            it("should match list order successfully", async () => {
                // 创建卖单
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                // 创建卖单并验证事件
                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(order)

                // 创建买单
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                // 执行订单匹配并验证
                await expect(await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.03") }))
                    .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                // 验证NFT所有权转移
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            });

            // 测试匹配集合买单
            it("should match collection bid order successfully", async () => {
                // 创建集合买单
                let now = parseInt(new Date() / 1000) + 10000000000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 1;
                let buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForCollection,  // 集合买单类型
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 4],               // 购买4个NFT
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                // 创建买单并支付ETH
                await expect(await esDex.connect(addr1).makeOrders([buyOrder], { value: toBn("0.04") }))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(buyOrder)
                const dbOrder = await esDex.orders(orderHash)

                // 创建并匹配多个卖单
                for (let i = 1; i <= 4; i++) {
                    now = parseInt(new Date() / 1000) + 100000
                    salt = 2;
                    tokenId = i;
                    sellOrder = {
                        side: Side.List,
                        saleKind: SaleKind.FixedPriceForItem,
                        maker: owner.address,
                        nft: [tokenId, nftAddress, 1],
                        price: toBn("0.01"),
                        expiry: now,
                        salt: salt,
                    }

                    // 执行匹配并验证
                    await expect(await esDex.matchOrder(sellOrder, buyOrder))
                        .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                    expect(await testERC721.ownerOf(tokenId)).to.equal(addr1.address)

                    // 验证订单状态
                    newStat = await esDex.filledAmount(orderHash);
                    expect(newStat).to.equal(i)
                }
            });

            it("should match item bid order successfully", async () => {
                //bid order
                let now = parseInt(new Date() / 1000) + 10000000000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.connect(addr1).makeOrders([buyOrder], { value: toBn("0.01") }))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(buyOrder)
                // console.log("buy orderHash: ", orderHash)

                const dbOrder = await esDex.orders(orderHash)
                // console.log("buy order: ", dbOrder)

                // market sell
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 0;
                sellOrder = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.matchOrder(sellOrder, buyOrder))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)

                // tx = await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") })
                // txRec = await tx.wait()
                // console.log("txRec: ", txRec.events)
                // console.log("gasUsed: ", txRec.gasUsed.toString())
            });

            it("should revert if order is the same", async () => {
                // 创建卖单
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                // 尝试用相同订单匹配，应该失败
                await expect(esDex.connect(addr1).matchOrder(order, order, { value: toBn("0.01") }))
                    .to.be.revertedWith("HD: same order")
            });

            it("should revert if side mismatch", async () => {
                // 创建两个相同类型的订单（都是卖单）
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                let buyOrder = {
                    side: Side.List,  // 错误：应该是Bid
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                // 验证匹配失败
                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") }))
                    .to.be.revertedWith("HD: side mismatch")
            });

            it("should revert if sale kind mismatch", async () => {
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForCollection,  // 集合销售类型
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                let buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForCollection,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") }))
                    .to.be.revertedWith("HD: kind mismatch")
            });

            it("should revert if list order's sale kind is for collection", async () => {
                //list order
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForCollection,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(order)
                // console.log("orderHash: ", orderHash)

                // market buy
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 0;
                buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") })).to.be.revertedWith("HD: kind mismatch")
                // await expect(await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") }))
                //     .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                // expect(await testERC721.ownerOf(0)).to.equal(addr1.address)

            });

            it("should revert if asset mismatch", async () => {
                //list order
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(order)
                // console.log("orderHash: ", orderHash)

                // market buy
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 1;
                buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") })).to.be.revertedWith("HD: asset mismatch")
            });

            it("should revert if order was canceled", async () => {
                //list order
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(order)
                // console.log("orderHash: ", orderHash)

                await expect(await esDex.cancelOrders([orderHash]))
                    .to.emit(esDex, "LogCancel")

                // market buy
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 0;
                buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") })).to.be.revertedWith("HD: order closed")
            });

            it("should revert if list order was filled", async () => {
                //list order
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(order)
                // console.log("orderHash: ", orderHash)

                // market buy
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 0;
                buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.03") }))
                    .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)

                await expect(esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.03") })).to.be.revertedWith("HD: order closed")
            });

            it("should revert if bid order was filled", async () => {
                //bid order
                let now = parseInt(new Date() / 1000) + 10000000000
                let salt = 1;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                let buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForCollection,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 2],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.connect(addr1).makeOrders([buyOrder], { value: toBn("0.02") }))
                    .to.emit(esDex, "LogMake")

                const orderHash = await testLibOrder.getOrderHash(buyOrder)
                // console.log("buy orderHash: ", orderHash)

                const dbOrder = await esDex.orders(orderHash)
                // console.log("buy order: ", dbOrder)

                // market sell
                now = parseInt(new Date() / 1000) + 100000
                salt = 2;
                nftAddress = testERC721.address;
                tokenId = 0;
                sellOrder = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.matchOrder(sellOrder, buyOrder))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)

                tokenId = 1;
                sellOrder2 = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }
                await expect(await esDex.matchOrder(sellOrder2, buyOrder))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(tokenId)).to.equal(addr1.address)

                await expect(esDex.matchOrder(sellOrder2, buyOrder)).to.be.revertedWith("HD: order closed")
            });
        })

        describe("should check match successfully if msg.sender is sellOrder.maker", async () => {
            let bidOrder;

            beforeEach(async function () {
                // bid offer
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 2;
                let nftAddress = testERC721.address;
                let tokenId = 1;
                bidOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForCollection,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                orders = [bidOrder]
                await expect(await esDex.connect(addr1).makeOrders(orders, { value: toBn("0.02") }))
                    .to.changeEtherBalances([addr1, esVault], [toBn("-0.01"), toBn("0.01")]);

                const orderHash = await testLibOrder.getOrderHash(bidOrder)
                // console.log("orderHash: ", orderHash)

            })

            it("should match order successfully", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                expect(await testERC721.ownerOf(0)).to.equal(owner.address)
                await expect(await esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            })

            it("should match order with exist list order successfully", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                orders = [order]
                await esDex.makeOrders(orders);

                expect(await testERC721.ownerOf(0)).to.equal(esVault.address)
                await expect(await esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            })

            it("should revert if msgValue > 0", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(owner).matchOrder(order, bidOrder, { value: toBn("0.01") }))
                    .to.be.revertedWith("HD: value > 0")
            })

            it("should revert if maker is zero", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: AddressZero,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.be.revertedWith("HD: sender invalid")
            })

            it("should revert if salt = 0", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 0;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.be.revertedWith("OVa: zero salt")
            })

            it("should revert if unsupported nft asset", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, AddressZero, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.be.revertedWith("OVa: unsupported nft asset")
            })

            it.skip("should revert if buy price < sell price", async () => {
                // accept bid 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(owner).matchOrder(order, bidOrder))
                    .to.be.revertedWith("HD: buy price < fill price")
            })
        })

        describe("should check match successfully if msg.sender is buyOrder.maker", async () => {
            let listOrder;

            beforeEach(async function () {
                // list offer
                let now = parseInt(new Date() / 1000) + 100000
                let salt = 2;
                let nftAddress = testERC721.address;
                let tokenId = 0;
                listOrder = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                orders = [listOrder]
                await esDex.connect(owner).makeOrders(orders)

                const orderHash = await testLibOrder.getOrderHash(listOrder)
                // console.log("orderHash: ", orderHash)
            })

            it("should match order successfully", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                expect(await testERC721.ownerOf(0)).to.equal(esVault.address)
                await expect(await esDex.connect(addr1).matchOrder(listOrder, order, { value: toBn("0.01") }))
                    .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            })

            it("should match order with exist bid order successfully", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }
                orders = [order]

                await expect(await esDex.connect(addr1).makeOrders(orders, { value: toBn("0.04") }))
                    .to.changeEtherBalances([addr1, esVault], [toBn("-0.01"), toBn("0.01")]);

                expect(await testERC721.ownerOf(0)).to.equal(esVault.address)
                await expect(await esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            })

            it("should revert if maker is zero", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: AddressZero,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.be.revertedWith("HD: sender invalid")
            })

            it("should revert if salt = 0", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 0;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.be.revertedWith("OVa: zero salt")
            })

            it("should revert if unsupported nft asset", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 1;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.01"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.be.revertedWith("HD: asset mismatch")
            })

            it("should revert if value < sell price", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.02"),
                    expiry: now,
                    salt: salt,
                }

                await expect(esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.be.revertedWith("HD: value < fill price")
            })

            it("should revert if buy price < sell price", async () => {
                // accept list == buy 
                now = parseInt(new Date() / 1000) + 100000;
                salt = 1;
                nftAddress = testERC721.address;
                tokenId = 0;
                let order = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("0.002"),
                    expiry: now,
                    salt: salt,
                }

                orders = [order]

                await expect(await esDex.connect(addr1).makeOrders(orders, { value: toBn("0.004") }))
                    .to.changeEtherBalances([addr1, esVault], [toBn("-0.002"), toBn("0.002")]);


                await expect(esDex.connect(addr1).matchOrder(listOrder, order))
                    .to.be.revertedWith("HD: buy price < fill price")
            })
        })
    })

    describe("should match orders successfully", async () => {
        it("should match list orders successfully", async () => {
            //list order
            let now = parseInt(new Date() / 1000) + 100000
            let salt = 1;
            let nftAddress = testERC721.address;
            let tokenId = 0;
            let order = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            await expect(await esDex.makeOrders([order]))
                .to.emit(esDex, "LogMake")

            const orderHash = await testLibOrder.getOrderHash(order)
            // console.log("orderHash: ", orderHash)

            now = parseInt(new Date() / 1000) + 100000
            salt = 1;
            nftAddress = testERC721.address;
            tokenId = 1;
            order2 = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.01"),
                expiry: now,
                salt: salt,
            }

            await expect(await esDex.makeOrders([order2]))
                .to.emit(esDex, "LogMake")

            // market buy
            now = parseInt(new Date() / 1000) + 100000
            salt = 2;
            nftAddress = testERC721.address;
            tokenId = 0;
            buyOrder = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: addr1.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            tokenId = 1;
            buyOrder2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForItem,
                maker: addr1.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            matchDetail1 = {
                sellOrder: order,
                buyOrder: buyOrder,
            }
            matchDetail2 = {
                sellOrder: order2,
                buyOrder: buyOrder2,
            }
            matchDetails = [matchDetail1, matchDetail2]

            successes = await esDex.connect(addr1).callStatic.matchOrders(matchDetails, { value: toBn("0.06") })
            expect(successes[0]).to.equal(true)
            expect(successes[1]).to.equal(true)

            await expect(await esDex.connect(addr1).matchOrders(matchDetails, { value: toBn("0.06") }))
                .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0004"), toBn("0.0196"), toBn("-0.02")]);

            expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            expect(await testERC721.ownerOf(1)).to.equal(addr1.address)
        });

        it("should match bid orders successfully", async () => {
            //bid order
            let now = parseInt(new Date() / 1000) + 10000000000
            let salt = 1;
            let nftAddress = testERC721.address;
            let tokenId = 0;
            let buyOrder = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForCollection,
                maker: addr1.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            const orderHash = await testLibOrder.getOrderHash(buyOrder)
            // console.log("orderHash: ", orderHash)

            now = parseInt(new Date() / 1000) + 100000
            salt = 1;
            nftAddress = testERC721.address;
            tokenId = 0;
            let buyOrder2 = {
                side: Side.Bid,
                saleKind: SaleKind.FixedPriceForCollection,
                maker: addr1.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            await expect(await esDex.connect(addr1).makeOrders([buyOrder, buyOrder2], { value: toBn("0.04") }))
                .to.emit(esDex, "LogMake")

            // market sell
            now = parseInt(new Date() / 1000) + 100000
            salt = 2;
            nftAddress = testERC721.address;
            tokenId = 1;
            sellOrder = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            tokenId = 2;
            sellOrder2 = {
                side: Side.List,
                saleKind: SaleKind.FixedPriceForItem,
                maker: owner.address,
                nft: [tokenId, nftAddress, 1],
                price: toBn("0.02"),
                expiry: now,
                salt: salt,
            }

            matchDetail1 = {
                sellOrder: sellOrder,
                buyOrder: buyOrder,
            }
            matchDetail2 = {
                sellOrder: sellOrder2,
                buyOrder: buyOrder2,
            }
            matchDetails = [matchDetail1, matchDetail2]
            // await expect(await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("0.01") }))
            //     .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.0002"), toBn("0.0098"), toBn("-0.01")]);
            // expect(await testERC721.ownerOf(0)).to.equal(addr1.address)

            // tx = await esDex.connect(addr1).matchOrders(matchDetails, { value: toBn("0.01") })
            // txRec = await tx.wait()
            // console.log("txRec: ", txRec.events)
            // console.log("gasUsed: ", txRec.gasUsed.toString())

            successes = await esDex.callStatic.matchOrders(matchDetails)
            // console.log("successes: ", successes)
            expect(successes[0]).to.equal(true)
            expect(successes[1]).to.equal(true)

            await expect(await esDex.matchOrders(matchDetails))
                .to.changeEtherBalances([esDex, owner, esVault], [toBn("0.0008"), toBn("0.0392"), toBn("-0.04")]);

            expect(await testERC721.ownerOf(1)).to.equal(addr1.address)
            expect(await testERC721.ownerOf(2)).to.equal(addr1.address)
        });
    })

    describe("should transfer nft successfully", async () => {
        // 测试ERC721 NFT转移
        it("should transfer erc721 successfully", async () => {
            // 验证初始NFT所有权
            expect(await testERC721.ownerOf(0)).to.equal(owner.address)
            expect(await testERC721.ownerOf(1)).to.equal(owner.address)

            // 准备转移参数
            to = addr1.address
            asset1 = [testERC721.address, 0]
            asset2 = [testERC721.address, 1]
            assets = [asset1, asset2]

            // 执行批量转移
            await esVault.batchTransferERC721(to, assets)
            
            // 验证转移结果
            expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            expect(await testERC721.ownerOf(1)).to.equal(addr1.address)
        });
    })

    // 测试模块7：ETH提现功能测试
    describe("withdraw ETH", async () => {
        // 测试ETH提现
        it("should withdraw ETH successfully", async () => {
            // 创建并成交一个大额订单来产生协议费
            {
                let order = {
                    side: Side.List,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: owner.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("1"),  // 1 ETH
                    expiry: now,
                    salt: salt,
                }

                await expect(await esDex.makeOrders([order]))
                    .to.emit(esDex, "LogMake")

                let buyOrder = {
                    side: Side.Bid,
                    saleKind: SaleKind.FixedPriceForItem,
                    maker: addr1.address,
                    nft: [tokenId, nftAddress, 1],
                    price: toBn("2"),
                    expiry: now,
                    salt: salt,
                }

                // 执行订单匹配，产生协议费
                await expect(await esDex.connect(addr1).matchOrder(order, buyOrder, { value: toBn("3") }))
                    .to.changeEtherBalances([esDex, owner, addr1], [toBn("0.02"), toBn("0.98"), toBn("-1")]);
                expect(await testERC721.ownerOf(0)).to.equal(addr1.address)
            }

            // 测试提现协议费
            await expect(await esDex.withdrawETH(owner.address, toBn("0.02")))
                .to.changeEtherBalances([esDex, owner], [toBn("-0.02"), toBn("0.02")])
        })
    })
})
