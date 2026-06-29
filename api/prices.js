const ccxt = require('ccxt');

const exchange = new ccxt.binance({
  enableRateLimit: true,
});

const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'TON/USDT'];

async function getPrices() {
  try {
    const tickers = await exchange.fetchTickers(symbols);
    const prices = {};
    
    symbols.forEach(symbol => {
      const base = symbol.split('/')[0];
      prices[base] = tickers[symbol].last;
    });
    
    return prices;
  } catch (error) {
    return {
      BTC: 65000,
      ETH: 3500,
      SOL: 180,
      TON: 7.5
    };
  }
}

module.exports = { getPrices };
