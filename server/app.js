const express = require('express');
const session = require('express-session');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const containerRoutes = require('./routes/containerRoutes');
const flavourRoutes = require('./routes/flavourRoutes');
const packageRoutes = require('./routes/packageRoutes');
const itemRoutes = require('./routes/itemRoutes');
const salesmanRoutes = require('./routes/salesmanRoute.js')
const ratesRoutes=require('./routes/ratesRoutes.js')
const transactionRoutes=require('./routes/transactionRoutes.js')
const purchaseRoutes=require('./routes/purchaseRoutes/purchaseRoutes.js')
const depoRoutes = require('./routes/depoRoutes.js');
const stockRoutes = require('./routes/stockRoutes.js');
const summaryRoutes = require("./Summary/SalesmanwiseItemwise.js");

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
app.use("/summary", summaryRoutes);

const port = 3000;
app.listen(port, () => (`server running at port ${port}`));