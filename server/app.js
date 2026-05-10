import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { initializeDefaultUser } from './config/initDefaultUser.js';
import authRoutes from './routes/authRoutes.js';
import containerRoutes from './routes/containerRoutes.js';
import flavourRoutes from './routes/flavourRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import salesmanRoutes from './routes/salesmanRoute.js';
import ratesRoutes from './routes/ratesRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes/purchaseRoutes.js';
import depoRoutes from './routes/depoRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import requireAuth from './middleware/requireAuth.js';
import requireDepo from './middleware/requireDepo.js';
import graphRoutes from './routes/graphRoutes.js';
import MongoStore from "connect-mongo";
import cron from "node-cron";

connectDB();
initializeDefaultUser().catch(err => console.error('Failed to initialize default user:', err));
const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://speed.aalsicoders.in',
  'https://speed-sanbeveragepvtltd.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));

app.use(session({
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI,
        collectionName: "sessions"
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.get("/ping", (req, res) => {
    res.send("Server is alive")
})

// cron.schedule("*/5 * * * *", async () => {
//     try {
//         await fetch("https://parliamentbackend.onrender.com/ping");
//         console.log("self ping succesful");

//     } catch (error) {
//         console.log("ping failed", error.message);

//     }
// })

app.use('/auth', authRoutes);
app.use('/depo', depoRoutes);

app.use(requireAuth);
app.use(requireDepo);
//protected routes
app.use('/container', containerRoutes);
app.use('/flavour', flavourRoutes);
app.use('/package', packageRoutes);
app.use('/item', itemRoutes);
app.use('/salesman', salesmanRoutes);
app.use('/rates', ratesRoutes);
app.use('/transaction', transactionRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/graph', graphRoutes);
app.use('/stock', stockRoutes);
app.use('/summary', summaryRoutes);



const port = 3000;
app.listen(port, () => (`server running at port ${port}`));