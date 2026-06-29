const express = require('express');
const cors = require('cors');
const { getPrices } = require('./prices');
const { executeTrade } = require('./trade');

const app = express();
app.use(cors());
app.use(express.json());

const users = new Map();

app.post('/api/init', (req, res) => {
  const { userId } = req.body;
  
  if (!users.has(userId)) {
    users.set(userId, {
      balance: 400,
      portfolio: {},
      trades: []
    });
  }
  
  res.json(users.get(userId));
});

app.get('/api/prices', async (req, res) => {
  const prices = await getPrices();
  res.json(prices);
});

app.post('/api/trade', async (req, res) => {
  const { userId, symbol, type, amount } = req.body;
  
  if (!users.has(userId)) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const result = await executeTrade(users, userId, symbol, type, amount);
  res.json(result);
});

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

module.exports = app;
