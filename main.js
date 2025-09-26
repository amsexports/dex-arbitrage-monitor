const DexArbitrageMonitor = require('./src/PriceMonitor');
const config = require('./config');

async function main() {
    const monitor = new DexArbitrageMonitor(
        config.providers,
        'YOUR_PRIVATE_KEY'
    );
    
    await monitor.monitorPrices(config.tokenPairs);
}

main().catch(console.error);
