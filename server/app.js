const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const containerRoutes = require('./routes/containerRoutes');
const flavourRoutes = require('./routes/flavourRoutes');
const packageRoutes = require('./routes/packageRoutes');
const itemRoutes = require('./routes/itemRoutes');
const salesmanRoutes = require('./routes/salesmanRoute.js')

connectDB();
const app = express();
app.use(express.json());

app.use(session({
    secret: "beverage-campa",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/auth', authRoutes);
app.use('/container', containerRoutes);
app.use('/flavour', flavourRoutes);
app.use('/package', packageRoutes);
app.use('/item', itemRoutes);
app.use('/salesman', salesmanRoutes);



const port = 3000;
app.listen(port, () => (`server running at port ${port}`));