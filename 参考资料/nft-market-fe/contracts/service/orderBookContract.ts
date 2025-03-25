import { ethers } from "ethers";
import EasySwapOrderBookABI from '../abis/EasySwapOrderBook.sol/EasySwapOrderBook.json';

export default class OrderBookContract {
    private contract: ethers.Contract | null;
    private signer: ethers.Signer | null;

    constructor() {
        this.contract = null;
    }

    async init() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        this.signer = signer;
        this.contract = new ethers.Contract(
            "0x8039A8DafF806B27dB59C05fE5AD680F19c34f5A",
            EasySwapOrderBookABI.abi,
            signer
        );
    }

    public async getOrders(params: {
        collection: string,
        tokenId: number,
        side: number,      // 0: buy, 1: sell
        saleKind: number,  // 通常是固定价格或拍卖
        count: number,     // 想要获取的订单数量
        price?: bigint,
        firstOrderKey?: string
    }) {
        await this.init();
        const zeroBytes32 = '0x' + '0'.repeat(64);
            
        const orders = await this.contract!.getOrders(
            params.collection,
            params.tokenId,
            params.side,
            params.saleKind,
            params.count,
            params.price || BigInt(0),    // 如果不需要价格过滤，传null
            params.firstOrderKey || zeroBytes32  // 如果是第一次查询，传null
        );
        // return orders;
        // // 处理返回的订单数据
        const formattedOrders = orders.resultOrders.map((order: any) => {
            return {
                maker: order.maker,
                nftContract: order.nft.collection,
                tokenId: order.nft.tokenId.toString(),
                price: ethers.formatEther(order.price),
                side: order.side,
                expiry: new Date(Number(order.expiry) * 1000).toLocaleString(),
                // 其他字段根据实际返回数据结构添加
            };
        });

        return {
            orders: formattedOrders,
            nextOrderKey: orders.nextOrderKey  // 用于分页查询
        };
    }

    async createOrder(orders: any[]) {
        await this.init();
        const tx = await this.contract!.createOrder(orders);
        return tx;
    }
}