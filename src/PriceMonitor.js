const { ethers } = require('ethers');
const axios = require('axios');
const WebSocket = require('ws');

class DexArbitrageMonitor {
    constructor(providers, walletPrivateKey) {
        this.providers = providers;
        this.wallet = new ethers.Wallet(walletPrivateKey);
        this.minProfitThreshold = 0.01; // 1%最小利润阈值
        
        // Uniswap V2 Router ABI (简化)
        this.uniswapABI = [
            "function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts)",
            "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
        ];
    }

    async monitorPrices(tokenPairs) {
        console.log('开始监控价格差异...');
        
        for (const pair of tokenPairs) {
            setInterval(async () => {
                await this.checkArbitrageOpportunity(pair);
            }, 5000); // 每5秒检查一次
        }
    }

    async checkArbitrageOpportunity(tokenPair) {
        try {
            const { tokenA, tokenB, dexes } = tokenPair;
            const prices = {};
            
            // 获取不同DEX的价格
            for (const dex of dexes) {
                prices[dex.name] = await this.getPrice(tokenA, tokenB, dex);
            }
            
            // 寻找套利机会
            const opportunity = this.findArbitrageOpportunity(prices, tokenA, tokenB);
            
            if (opportunity && opportunity.profit > this.minProfitThreshold) {
                console.log(`发现套利机会: ${opportunity.buyDex} -> ${opportunity.sellDex}`);
                console.log(`预期利润: ${opportunity.profit.toFixed(4)}%`);
                
                // 执行套利交易
                await this.executeArbitrage(opportunity, tokenPair);
            }
            
        } catch (error) {
            console.error('检查套利机会时出错:', error.message);
        }
    }

    async getPrice(tokenA, tokenB, dex) {
        const provider = new ethers.JsonRpcProvider(dex.rpc);
        const router = new ethers.Contract(dex.routerAddress, this.uniswapABI, provider);
        
        const amountIn = ethers.parseEther("1"); // 1个token的价格
        const path = [tokenA, tokenB];
        
        try {
            const amounts = await router.getAmountsOut(amountIn, path);
            return parseFloat(ethers.formatEther(amounts[1]));
        } catch (error) {
            console.error(`获取${dex.name}价格失败:`, error.message);
            return 0;
        }
    }

    findArbitrageOpportunity(prices, tokenA, tokenB) {
        const dexNames = Object.keys(prices);
        let bestOpportunity = null;
        let maxProfit = 0;

        for (let i = 0; i < dexNames.length; i++) {
            for (let j = 0; j < dexNames.length; j++) {
                if (i !== j) {
                    const buyPrice = prices[dexNames[i]];
                    const sellPrice = prices[dexNames[j]];
                    
                    if (buyPrice > 0 && sellPrice > 0) {
                        const profit = ((sellPrice - buyPrice) / buyPrice) * 100;
                        
                        if (profit > maxProfit && profit > this.minProfitThreshold) {
                            maxProfit = profit;
                            bestOpportunity = {
                                buyDex: dexNames[i],
                                sellDex: dexNames[j],
                                buyPrice,
                                sellPrice,
                                profit
                            };
                        }
                    }
                }
            }
        }

        return bestOpportunity;
    }

    async executeArbitrage(opportunity, tokenPair) {
        console.log('执行套利交易...');
        
        try {
            // 这里实现具体的套利逻辑
            // 1. 在低价DEX买入
            // 2. 在高价DEX卖出
            
            const amountIn = ethers.parseEther("1"); // 交易金额
            
            // 注意: 实际实现需要考虑滑点、gas费、流动性等因素
            console.log('套利交易执行完成');
            
        } catch (error) {
            console.error('执行套利交易失败:', error.message);
        }
    }
}
