module.exports = {
    providers: {
        ethereum: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        bsc: 'https://bsc-dataseed.binance.org/',
        polygon: 'https://polygon-rpc.com/'
    },
    
    dexes: [
        {
            name: 'Uniswap',
            routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
        },
        {
            name: 'SushiSwap',
            routerAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
            rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
        }
    ],
    
    tokenPairs: [
        {
            tokenA: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
            tokenB: '0xA0b86a33E6441b0b5C4C1B89DfC2FbB4e0A0b26D', // USDT
            dexes: ['Uniswap', 'SushiSwap']
        }
    ]
};
