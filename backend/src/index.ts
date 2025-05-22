import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import morgan from "morgan"
import jwt from 'jsonwebtoken';
import mongoose, { Schema, Document, Model } from 'mongoose';
import axios from 'axios';
import config from './config';
import {WebSocket} from 'ws';
import verifyCaptcha, { checkVerificationCode, sendVerificationCode } from './util';

const btc = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
const eth = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
const sol = new WebSocket('wss://stream.binance.com:9443/ws/solusdt@trade');
const xrp = new WebSocket('wss://stream.binance.com:9443/ws/xrpusdt@trade');
const ltc = new WebSocket('wss://stream.binance.com:9443/ws/ltcusdt@trade');

var cryptoPrice = {
  btc: 0,
  eth: 0,
  sol: 0,
  xrp: 0,
  ltc: 0
}

btc.on('open', () => {
  console.log('Websocket connected!');
});

btc.on('message', (data: any) => {
  const trade = JSON.parse(data);
  cryptoPrice.btc = parseFloat(trade.p);
});
eth.on('open', () => {
  console.log('Websocket connected!');
});

eth.on('message', (data: any) => {
  const trade = JSON.parse(data);
  cryptoPrice.eth = parseFloat(trade.p);
});
sol.on('open', () => {
  console.log('Websocket connected!');
});

sol.on('message', (data: any) => {
  const trade = JSON.parse(data);
  cryptoPrice.sol = parseFloat(trade.p);
});
xrp.on('open', () => {
  console.log('Websocket connected!');
});

xrp.on('message', (data: any) => {
  const trade = JSON.parse(data);
  cryptoPrice.xrp = parseFloat(trade.p);
});
ltc.on('open', () => {
  console.log('Websocket connected!');
});

ltc.on('message', (data: any) => {
  const trade = JSON.parse(data);
  cryptoPrice.ltc = parseFloat(trade.p);
});

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/userdb';

app.use(express.json());
app.use(morgan('dev'))

interface IUser extends Document {
  username: string;
  phoneNumber: string;
  passwordHash: string;
  isVerified: boolean;
  score: number;
}

interface IBet extends Document {
  phoneNumber: string;
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
  phoneNumber: {type: String, required: true},
  isVerified: {type: Boolean, required: true},
  score: { type: Number }
});

const betSchema: Schema<IBet> = new Schema({
  phoneNumber: { type: String, required: true },
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
  const { phoneNumber, username, password, captchaToken } = req.body;
  
  if (captchaToken == '') return res.status(400).json({error: 'captcha_error'});

  if (await verifyCaptcha(captchaToken) == false) return res.status(400).json({error: 'captcha_error'});

  if (!phoneNumber || !username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(409).json({ error: 'Phone already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, phoneNumber, passwordHash, isVerified: false, score: 0 });
    await user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin route
app.post('/signin', async (req: Request, res: Response) => {
  const { phoneNumber, password, captchaToken } = req.body;
  try {
    if (captchaToken == '') return res.status(400).json({error: 'captcha_error'});
    if (await verifyCaptcha(captchaToken) == false) return res.status(400).json({error: 'captcha_error'});

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isVerified) return res.status(200).json({msg: 'not_verified'});
    
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ phoneNumber }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/send_verify', async (req: Request, res: Response) => {
  try {
    await sendVerificationCode(req.body.phoneNumber);
    return res.status(200).json({msg: 'sent_verify'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: 'unknown_error'});
  }
});

app.post('/check_verify', async (req: Request, res: Response) => {
  try {
    const isVerified = await checkVerificationCode(req.body.phoneNumber, req.body.code);
    if(!isVerified) return res.status(400).json({msg: 'Invalid verification code.'});
    await User.updateOne({phoneNumber: req.body.phoneNumber}, {isVerified: true}, {new: true});
    return res.status(200).json({msg: 'verify_success'});
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: 'unknown_error'});
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
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;
    const user = await User.findOne({phoneNumber: phoneNumber});
    if(user == null) return res.status(401).json({msg: 'Please signup!'})
    if(user.score < betAmount) return res.status(400).json({msg: 'Insufficient funds.'})
    // Validate bet fields
    if (!['up', 'down'].includes(betType) || !betAmount || ![60, 120, 300, 600, 1800].includes(period)) {
      return res.status(400).json({ error: 'Invalid bet parameters' });
    }

    const betItem = await Bet.findOne({
      phoneNumber: phoneNumber,
      status: 'waiting'
    });
    console.log(betItem);
    
    if (betItem) return res.status(400).json({msg: 'already betted'});
    // Assume currency is always 'usd' for now, and get current price/timestamp (stubbed)
    const timestamp = Date.now();

    const bet = new Bet({
      phoneNumber,
      timestamp,
      pricestamp: cryptoPrice.btc,
      currency,
      status: 'waiting',
      betType,
      betAmount,
      period
    });
    await bet.save();

    User.findOneAndUpdate(
      {phoneNumber: phoneNumber},
      {$inc: {score: -betAmount}},
      {new: true}
    )

    return res.status(201).json({ message: 'Bet placed', bet });
  } catch (err) {
    console.log(err);
    
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
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;

    Bet.findOne({
      phoneNumber: phoneNumber,
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
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;

    const bet = await Bet.findOne({
      status: 'waiting',
      phoneNumber: phoneNumber
    });
    if(bet?.status !== 'waiting') return res.status(200).json({msg: "Please place bet.", code: "no_bet"});
    const now = Date.now();
    if(now - bet.timestamp >= bet.period * 1000) { // Finished
      const price = cryptoPrice.btc;
      if(price > bet.pricestamp && bet.betType === 'up' || price < bet.pricestamp && bet.betType === 'down') { // Win the Bet
        bet.status = 'win';
        User.findOneAndUpdate(
          {phoneNumber: bet.phoneNumber},
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
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }

    // TODO: In a real app, here you’d record the deposit in the DB, update user balance, etc.
    await User.updateOne({phoneNumber: phoneNumber}, {
      $inc: {score: amount},
    }, {new: true});
    // For now, just acknowledge the deposit
    return res.status(200).json({ message: 'Deposit confirmed', amount });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.get('/get_history', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;

    const history = await Bet.find({phoneNumber: phoneNumber, status: {$in: ['win', 'lose']}});
    res.status(200).json({history})
  } catch (err) {
    console.log(err);
  }
})

app.get('/get_balance', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {phoneNumber: string};
    const phoneNumber = payload.phoneNumber;
    const user = await User.findOne({phoneNumber: phoneNumber});
    const score = user?.score;
    res.json({score});
  } catch (err) {
    console.log(err);
  }
})

app.get('/all_price', (req: Request, res: Response) => {
  res.json({cryptoPrice});
})

app.get('/btc_price', (req: Request, res: Response) => {
  res.json({btc: cryptoPrice.btc});
})

app.post('/withdraw', async (req: Request, res: Response) => {
  const { address, amount } = req.body;
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});