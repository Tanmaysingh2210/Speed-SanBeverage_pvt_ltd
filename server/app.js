import express from 'express';
import session from 'express-session';
import cors from 'cors'; 
import 'dotenv/config';
import connectDB from './config/db.js';
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
connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: "beverage-campa",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly:true,
        sameSite: 'lax'
     }
}));

app.use('/auth', authRoutes);
app.use('/container', containerRoutes);
app.use('/flavour', flavourRoutes);
app.use('/package', packageRoutes);
app.use('/item', itemRoutes);
app.use('/salesman', salesmanRoutes);
app.use('/rates', ratesRoutes);
app.use('/transaction' , transactionRoutes);
app.use('/purchase' , purchaseRoutes);
app.use('/depo',depoRoutes);
app.use('/stock', stockRoutes);
app.use('/summary' , summaryRoutes);



const port = 3000;
app.listen(port, () => (`server running at port ${port}`));