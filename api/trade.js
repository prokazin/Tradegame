const { getPrices } = require('./prices');

async function executeTrade(users, userId, symbol, type, amount) {
  const user = users.get(userId);
  if (!user) return { error: 'User not found' };

  const prices = await getPrices();
  const price = prices[symbol];
  
  if (!price) return { error: 'Invalid symbol' };

  const totalCost = amount * price;

  if (type === 'buy') {
    if (user.balance < totalCost) {
      return { error: 'Insufficient balance' };
    }
    
    user.balance -= totalCost;
    user.portfolio[symbol] = (user.portfolio[symbol] || 0) + amount;
    
  } else if (type === 'sell') {
    if (!user.portfolio[symbol] || user.portfolio[symbol] < amount) {
      return { error: 'Insufficient assets' };
    }
    
    user.balance += totalCost;
    user.portfolio[symbol] -= amount;
    
    if (user.portfolio[symbol] === 0) {
      delete user.portfolio[symbol];
    }
  }

  user.trades.push({
    type,
    symbol,
    amount,
    price,
    timestamp: new Date().toISOString()
  });

  return {
    balance: user.balance,
    portfolio: user.portfolio,
    trade: { type, symbol, amount, price }
  };
}

module.exports = { executeTrade };
