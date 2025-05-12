import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import morgan from "morgan"
import jwt from 'jsonwebtoken';
import mongoose, { Schema, Document, Model } from 'mongoose';
import axios from 'axios';
import config from './config';
import {WebSocket} from 'ws';

const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

var btcPrice = 0;

ws.on('open', () => {
  console.log('Websocket connected!');
});

ws.on('message', (data: any) => {
  const trade = JSON.parse(data);
  btcPrice = parseFloat(trade.p);
});

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/userdb';

app.use(express.json());
app.use(morgan('dev'))

interface IUser extends Document {
  username: string;
  passwordHash: string;
  score: number;
}

interface IBet extends Document {
  username: string;
  timestamp: number;
  pricestamp: number;
  currency: string;
  status: 'win' | 'lose' | 'waiting';
  betType: 'up' | 'down';
  betAmount: number;
  period: 60 | 120 | 300 | 600 | 1800;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  score: { type: Number }
});

const betSchema: Schema<IBet> = new Schema({
  username: { type: String, required: true },
  timestamp: { type: Number, required: true },
  pricestamp: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  betType: { type: String, required: true },
  betAmount: { type: Number, required: true },
  period: { type: Number, required: true }
})

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
const Bet: Model<IBet> = mongoose.model<IBet>('Bet', betSchema);

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB via Mongoose'))
  .catch((err: unknown) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const JWT_SECRET = 'Nicesky254*'; // Store this securely in env variables

// Signup route
app.post('/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req);
  
  console.log(username, password)
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, score: 0 });
    await user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin route
app.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bet', async (req: Request, res: Response) => {
  const { betType, betAmount, period, currency } = req.body;
  // Extract and validate token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT and get username
    const payload = jwt.verify(token, JWT_SECRET) as { username: string };
    const username = payload.username;
    const user = await User.findOne({username: username});
    if(user == null) return res.status(401).json({msg: 'Please signup!'})
    if(user.score < betAmount) return res.status(400).json({msg: 'Insufficient funds.'})
    // Validate bet fields
    if (!['up', 'down'].includes(betType) || !betAmount || ![60, 120, 300, 600, 1800].includes(period)) {
      return res.status(400).json({ error: 'Invalid bet parameters' });
    }

    const betItem = await Bet.findOne({
      username: username,
      status: 'waiting'
    });
    console.log(betItem);
    
    if (betItem) return res.status(400).json({msg: 'already betted'});
    // Assume currency is always 'usd' for now, and get current price/timestamp (stubbed)
    const pricestamp = btcPrice; // In a real app, fetch the current price
    const timestamp = Date.now();

    const bet = new Bet({
      username,
      timestamp,
      pricestamp: btcPrice,
      currency,
      status: 'waiting',
      betType,
      betAmount,
      period
    });
    await bet.save();

    User.findOneAndUpdate(
      {username: username},
      {$inc: {score: -betAmount}},
      {new: true}
    )

    return res.status(201).json({ message: 'Bet placed', bet });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

});

app.get('/get_bet', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {username: string};
    const username = payload.username;

    Bet.findOne({
      username: username,
      status: 'waiting'
    }).then(item => {
      const bet = {
        betId: item?._id,
        currency: item?.currency,
        betAmount: item?.betAmount,
        betType: item?.betType,
        timestamp: item?.timestamp,
        period: item?.period,
        pricestamp: item?.pricestamp
      }
      if(!item) return res.status(200).json({msg: "Please place bet.", code: "no_bet"});
      return res.status(200).json({bet, msg: "waiting"});
    })
  } catch (err) {
    console.log(err);
  }
});

app.post('/check_bet', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {username: string};
    const username = payload.username;

    const bet = await Bet.findOne({
      status: 'waiting',
      username: username
    });
    if(bet?.status !== 'waiting') return res.status(200).json({msg: "Please place bet.", code: "no_bet"});
    const now = Date.now();
    if(now - bet.timestamp >= bet.period * 1000) { // Finished
      const price = btcPrice;
      if(price > bet.pricestamp && bet.betType === 'up' || price < bet.pricestamp && bet.betType === 'down') { // Win the Bet
        bet.status = 'win';
        User.findOneAndUpdate(
          {username: bet.username},
          {$inc: {score: bet.pricestamp * Number(config.WIN_BUDGET_RATE)}},
          {new: true}
        );
        bet.save();
        res.json({msg: 'win bet'});
      } else {
        bet.status = 'lose';
        bet.save();
        res.json({msg: "lose bet"})
      }
    }
  } catch (err) {
    console.log(err);
  }
})

app.post('/confirm_deposit', async (req: Request, res: Response) => {
  const { amount } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { username: string };
    const username = payload.username;

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }

    // TODO: In a real app, here you’d record the deposit in the DB, update user balance, etc.
    await User.updateOne({username: username}, {
      $inc: {score: amount},
    }, {new: true});
    // For now, just acknowledge the deposit
    return res.status(200).json({ message: 'Deposit confirmed', username, amount });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.get('/btc_price', (req: Request, res: Response) => {
  res.json({btc: btcPrice});
})

app.post('/withdraw', async (req: Request, res: Response) => {
  const { address, amount } = req.body;
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});